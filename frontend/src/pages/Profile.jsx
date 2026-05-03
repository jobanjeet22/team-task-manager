// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import api from '../api/axios';
// import toast from 'react-hot-toast';
// import { getInitials } from '../utils/helpers';

// const AVATAR_COLORS = [
//   '#4f6ef7', '#10b981', '#f59e0b', '#ef4444',
//   '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'
// ];

// const Profile = () => {
//   const { user, login } = useAuth();
//   const [searchParams] = useSearchParams();
//   const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'password' ? 'password' : 'profile');

//   // Profile form
//   const [name, setName] = useState(user?.name || '');
//   const [avatarColor, setAvatarColor] = useState(user?.avatarColor || AVATAR_COLORS[0]);
//   const [profileLoading, setProfileLoading] = useState(false);

//   // Password form
//   const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
//   const [showPass, setShowPass] = useState(false);
//   const [passLoading, setPassLoading] = useState(false);

//   // Sync tab from URL param
//   useEffect(() => {
//     if (searchParams.get('tab') === 'password') setActiveTab('password');
//   }, [searchParams]);

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     if (name.trim().length < 2) return toast.error('Name must be at least 2 characters');
//     setProfileLoading(true);
//     try {
//       const { data } = await api.put('/users/profile', { name: name.trim(), avatarColor });
//       // Update user in context by re-fetching
//       toast.success('Profile updated successfully ✓');
//       // Refresh user in localStorage
//       const stored = JSON.parse(localStorage.getItem('user') || '{}');
//       localStorage.setItem('user', JSON.stringify({ ...stored, name: data.user.name }));
//       // Force page refresh to sync navbar
//       window.location.reload();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   const handlePasswordChange = async (e) => {
//     e.preventDefault();
//     if (!passForm.current) return toast.error('Enter your current password');
//     if (passForm.newPass.length < 6) return toast.error('New password must be at least 6 characters');
//     if (passForm.newPass !== passForm.confirm) return toast.error('New passwords do not match');
//     if (passForm.current === passForm.newPass) return toast.error('New password must be different from current');

//     setPassLoading(true);
//     try {
//       await api.put('/users/password', {
//         currentPassword: passForm.current,
//         newPassword: passForm.newPass
//       });
//       toast.success('Password changed successfully 🔒');
//       setPassForm({ current: '', newPass: '', confirm: '' });
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to change password');
//     } finally {
//       setPassLoading(false);
//     }
//   };

//   const strength = passForm.newPass.length === 0 ? 0
//     : passForm.newPass.length < 6 ? 1
//     : passForm.newPass.length < 10 ? 2 : 3;
//   const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
//   const strengthColor = ['', 'bg-red-500', 'bg-amber-400', 'bg-emerald-500'];

//   return (
//     <div className="fade-in max-w-2xl mx-auto">
//       {/* Page header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Account Settings</h1>
//         <p className="text-slate-400 mt-1">Manage your profile and password</p>
//       </div>

//       {/* Avatar preview card */}
//       <div className="card p-6 mb-6 flex items-center gap-5">
//         <div
//           className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg transition-all"
//           style={{ backgroundColor: avatarColor }}
//         >
//           {getInitials(name || user?.name)}
//         </div>
//         <div>
//           <p className="text-xl font-bold">{name || user?.name}</p>
//           <p className="text-slate-400 text-sm">{user?.email}</p>
//           <span className="inline-block mt-1.5 text-xs bg-brand-500/20 text-brand-400 px-2.5 py-0.5 rounded-full capitalize font-medium">
//             {user?.role}
//           </span>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-1 mb-6 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
//         {[
//           { key: 'profile', label: '👤 Edit Profile' },
//           { key: 'password', label: '🔒 Change Password' },
//         ].map(tab => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
//               activeTab === tab.key
//                 ? 'bg-brand-500 text-white shadow'
//                 : 'text-slate-400 hover:text-white'
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Profile Tab */}
//       {activeTab === 'profile' && (
//         <div className="card p-6 fade-in">
//           <h2 className="font-bold text-lg mb-5">Edit Profile</h2>
//           <form onSubmit={handleProfileUpdate} className="space-y-5">

//             {/* Name */}
//             <div>
//               <label className="label">Full name</label>
//               <input
//                 type="text"
//                 className="input"
//                 placeholder="Your name"
//                 value={name}
//                 onChange={e => setName(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Email (read-only) */}
//             <div>
//               <label className="label">Email address</label>
//               <input
//                 type="email"
//                 className="input opacity-50 cursor-not-allowed"
//                 value={user?.email}
//                 disabled
//               />
//               <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
//             </div>

//             {/* Avatar color picker */}
//             <div>
//               <label className="label">Avatar color</label>
//               <div className="flex gap-3 flex-wrap">
//                 {AVATAR_COLORS.map(color => (
//                   <button
//                     key={color}
//                     type="button"
//                     onClick={() => setAvatarColor(color)}
//                     className={`w-9 h-9 rounded-xl transition-all ${
//                       avatarColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-105'
//                     }`}
//                     style={{ backgroundColor: color }}
//                     title={color}
//                   />
//                 ))}
//               </div>
//               <p className="text-xs text-slate-500 mt-2">This color is used for your avatar initials</p>
//             </div>

//             <button type="submit" className="btn-primary" disabled={profileLoading}>
//               {profileLoading ? (
//                 <span className="flex items-center gap-2">
//                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   Saving...
//                 </span>
//               ) : 'Save Changes'}
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Password Tab */}
//       {activeTab === 'password' && (
//         <div className="card p-6 fade-in">
//           <h2 className="font-bold text-lg mb-1">Change Password</h2>
//           <p className="text-sm text-slate-400 mb-5">Choose a strong password with at least 6 characters.</p>

//           <form onSubmit={handlePasswordChange} className="space-y-5">

//             {/* Current password */}
//             <div>
//               <label className="label">Current password</label>
//               <div className="relative">
//                 <input
//                   type={showPass ? 'text' : 'password'}
//                   className="input pr-10"
//                   placeholder="Enter current password"
//                   value={passForm.current}
//                   onChange={e => setPassForm({ ...passForm, current: e.target.value })}
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
//                   onClick={() => setShowPass(p => !p)}
//                 >
//                   {showPass ? '🙈' : '👁️'}
//                 </button>
//               </div>
//             </div>

//             {/* New password */}
//             <div>
//               <label className="label">New password</label>
//               <input
//                 type={showPass ? 'text' : 'password'}
//                 className="input"
//                 placeholder="Min 6 characters"
//                 value={passForm.newPass}
//                 onChange={e => setPassForm({ ...passForm, newPass: e.target.value })}
//                 required
//               />
//               {passForm.newPass.length > 0 && (
//                 <div className="mt-2">
//                   <div className="flex gap-1 mb-1">
//                     {[1,2,3].map(i => (
//                       <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : 'bg-slate-700'}`} />
//                     ))}
//                   </div>
//                   <p className="text-xs text-slate-400">Strength: <span className="font-medium">{strengthLabel[strength]}</span></p>
//                 </div>
//               )}
//             </div>

//             {/* Confirm new password */}
//             <div>
//               <label className="label">Confirm new password</label>
//               <input
//                 type={showPass ? 'text' : 'password'}
//                 className="input"
//                 placeholder="Re-enter new password"
//                 value={passForm.confirm}
//                 onChange={e => setPassForm({ ...passForm, confirm: e.target.value })}
//                 required
//               />
//               {passForm.confirm && passForm.newPass !== passForm.confirm && (
//                 <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
//               )}
//               {passForm.confirm && passForm.newPass === passForm.confirm && passForm.newPass.length >= 6 && (
//                 <p className="text-xs text-emerald-400 mt-1">✓ Passwords match</p>
//               )}
//             </div>

//             <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-sm text-amber-400">
//               ⚠️ You will need to sign in again after changing your password.
//             </div>

//             <button type="submit" className="btn-primary" disabled={passLoading}>
//               {passLoading ? (
//                 <span className="flex items-center gap-2">
//                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   Changing password...
//                 </span>
//               ) : 'Change Password'}
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;


import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { getInitials } from '../utils/helpers';

const AVATAR_COLORS = [
  '#4f6ef7', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'
];

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'password' ? 'password' : 'profile'
  );

  const [name, setName] = useState(user?.name || '');
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor || AVATAR_COLORS[0]);
  const [profileLoading, setProfileLoading] = useState(false);

  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    setActiveTab(searchParams.get('tab') === 'password' ? 'password' : 'profile');
  }, [searchParams]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      return toast.error('Name must be at least 2 characters');
    }
    setProfileLoading(true);
    try {
      const { data } = await api.put('/users/profile', { name: name.trim(), avatarColor });
      // ✅ Update context in-place — NO window.location.reload()
      updateUser({ name: data.user.name, avatarColor });
      toast.success('Profile updated ✓');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passForm.current) return toast.error('Enter your current password');
    if (passForm.newPass.length < 6) return toast.error('New password must be at least 6 characters');
    if (passForm.newPass !== passForm.confirm) return toast.error('Passwords do not match');
    if (passForm.current === passForm.newPass) return toast.error('New password must differ from current');

    setPassLoading(true);
    try {
      await api.put('/users/password', {
        currentPassword: passForm.current,
        newPassword: passForm.newPass,
      });
      toast.success('Password changed! Signing you out...');
      setPassForm({ current: '', newPass: '', confirm: '' });
      setTimeout(() => logout(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  const strength =
    passForm.newPass.length === 0 ? 0
    : passForm.newPass.length < 6 ? 1
    : passForm.newPass.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-500', 'bg-amber-400', 'bg-emerald-500'];

  return (
    <div className="fade-in max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-slate-400 mt-1">Manage your profile and security</p>
      </div>

      {/* Avatar preview */}
      <div className="card p-6 mb-6 flex items-center gap-5">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg transition-all"
          style={{ backgroundColor: avatarColor }}
        >
          {getInitials(name || user?.name)}
        </div>
        <div>
          <p className="text-xl font-bold">{name || user?.name}</p>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <span className="inline-block mt-1.5 text-xs bg-brand-500/20 text-brand-400 px-2.5 py-0.5 rounded-full capitalize font-medium">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
        {[
          { key: 'profile', label: '👤 Edit Profile' },
          { key: 'password', label: '🔒 Change Password' },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-brand-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card p-6 fade-in">
          <h2 className="font-bold text-lg mb-5">Edit Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div>
              <label className="label">Full name *</label>
              <input
                type="text" className="input" placeholder="Your full name"
                value={name} onChange={e => setName(e.target.value)}
                required minLength={2}
              />
            </div>
            <div>
              <label className="label">Email address</label>
              <input
                type="email" className="input opacity-50 cursor-not-allowed"
                value={user?.email || ''} disabled
              />
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="label">Avatar color</label>
              <div className="flex gap-3 flex-wrap mt-1">
                {AVATAR_COLORS.map(color => (
                  <button
                    key={color} type="button"
                    onClick={() => setAvatarColor(color)}
                    className={`w-9 h-9 rounded-xl transition-all ${
                      avatarColor === color
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">Color used for your avatar initials</p>
            </div>
            <button type="submit" className="btn-primary" disabled={profileLoading}>
              {profileLoading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</span>
                : 'Save Changes'
              }
            </button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="card p-6 fade-in">
          <h2 className="font-bold text-lg mb-1">Change Password</h2>
          <p className="text-sm text-slate-400 mb-5">Minimum 6 characters required.</p>
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div>
              <label className="label">Current password *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} className="input pr-10"
                  placeholder="Enter current password"
                  value={passForm.current}
                  onChange={e => setPassForm({ ...passForm, current: e.target.value })}
                  required
                />
                <button type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  onClick={() => setShowPass(p => !p)}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label className="label">New password *</label>
              <input
                type={showPass ? 'text' : 'password'} className="input"
                placeholder="Min 6 characters"
                value={passForm.newPass}
                onChange={e => setPassForm({ ...passForm, newPass: e.target.value })}
                required
              />
              {passForm.newPass.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : 'bg-slate-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">Strength: <span className="font-medium">{strengthLabel[strength]}</span></p>
                </div>
              )}
            </div>
            <div>
              <label className="label">Confirm new password *</label>
              <input
                type={showPass ? 'text' : 'password'} className="input"
                placeholder="Re-enter new password"
                value={passForm.confirm}
                onChange={e => setPassForm({ ...passForm, confirm: e.target.value })}
                required
              />
              {passForm.confirm && passForm.newPass !== passForm.confirm && (
                <p className="text-xs text-red-400 mt-1">❌ Passwords do not match</p>
              )}
              {passForm.confirm && passForm.newPass === passForm.confirm && passForm.newPass.length >= 6 && (
                <p className="text-xs text-emerald-400 mt-1">✓ Passwords match</p>
              )}
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-sm text-amber-400">
              ⚠️ You will be signed out automatically after changing your password.
            </div>
            <button type="submit" className="btn-primary" disabled={passLoading}>
              {passLoading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Changing...</span>
                : 'Change Password'
              }
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;