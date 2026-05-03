// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';

// const Signup = () => {
//   const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
//   const [loading, setLoading] = useState(false);
//   const { signup } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
//     setLoading(true);
//     try {
//       await signup(form.name, form.email, form.password, form.role);
//       toast.success('Account created! Welcome to TaskFlow 🎉');
//       navigate('/dashboard');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Signup failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl" />
//       </div>

//       <div className="w-full max-w-md fade-in">
//         <div className="text-center mb-8">
//           <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" stroke="currentColor" strokeWidth={2}>
//               <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold">Create account</h1>
//           <p className="text-slate-400 mt-2">Join TaskFlow and manage your team</p>
//         </div>

//         <div className="card p-8">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="label">Full name</label>
//               <input type="text" className="input" placeholder="John Doe"
//                 value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
//             </div>
//             <div>
//               <label className="label">Email address</label>
//               <input type="email" className="input" placeholder="you@example.com"
//                 value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
//             </div>
//             <div>
//               <label className="label">Password</label>
//               <input type="password" className="input" placeholder="Min 6 characters"
//                 value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
//             </div>
//             <div>
//               <label className="label">Role</label>
//               <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
//                 <option value="member">Member</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>
//             <button type="submit" className="btn-primary w-full" disabled={loading}>
//               {loading ? 'Creating account...' : 'Create account'}
//             </button>
//           </form>

//           <p className="text-center text-sm text-slate-500 mt-6">
//             Already have an account?{' '}
//             <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;



import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'member' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (form.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters'); return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Enter a valid email address'); return false;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return false;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match'); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/auth/signup', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      toast.success('Account created! Please sign in 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 8 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-500', 'bg-amber-400', 'bg-emerald-500'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" stroke="currentColor" strokeWidth={2}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Create account</h1>
          <p className="text-slate-400 mt-2">Join TaskFlow and manage your team</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="label">Full name</label>
              <input
                type="text" className="input" placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <input
                type="email" className="input" placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  onClick={() => setShowPass(p => !p)}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {/* Strength bar */}
              {form.password.length > 0 && (
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

            {/* Confirm Password */}
            <div>
              <label className="label">Confirm password</label>
              <input
                type={showPass ? 'text' : 'password'}
                className="input"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
              {form.confirmPassword && form.password === form.confirmPassword && form.password.length >= 6 && (
                <p className="text-xs text-emerald-400 mt-1">✓ Passwords match</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="label">I am joining as</label>
              <div className="grid grid-cols-2 gap-3">
                {['member', 'admin'].map(r => (
                  <button
                    key={r} type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                      form.role === r
                        ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {r === 'admin' ? '👑 Admin' : '👤 Member'}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;