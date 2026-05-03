// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { getInitials } from '../utils/helpers';
// import toast from 'react-hot-toast';

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     toast.success('Logged out successfully');
//     navigate('/login');
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
//       <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//         <Link to="/dashboard" className="flex items-center gap-2.5">
//           <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
//             <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2}>
//               <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <span className="font-bold text-lg tracking-tight">TaskFlow</span>
//         </Link>

//         <div className="flex items-center gap-3">
//           <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">Dashboard</Link>
//           <Link to="/projects" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">Projects</Link>

//           <div className="flex items-center gap-2 ml-2">
//             <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-sm font-bold text-brand-400">
//               {getInitials(user?.name)}
//             </div>
//             <div className="hidden sm:block">
//               <p className="text-sm font-medium leading-none">{user?.name}</p>
//               <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
//             </div>
//           </div>

//           <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-400 transition-colors ml-1">
//             Logout
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">TaskFlow</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block px-3 py-1.5 rounded-lg hover:bg-slate-800">
            Dashboard
          </Link>
          <Link to="/projects" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block px-3 py-1.5 rounded-lg hover:bg-slate-800">
            Projects
          </Link>
          <Link to="/tasks" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block px-3 py-1.5 rounded-lg hover:bg-slate-800">
            My Tasks
          </Link>

          {/* Profile avatar + dropdown */}
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold text-white">
                {getInitials(user?.name)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/50">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-xs bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full capitalize">
                    {user?.role}
                  </span>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <span className="text-base">👤</span>
                    Edit Profile
                  </Link>
                  <Link
                    to="/profile?tab=password"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <span className="text-base">🔒</span>
                    Change Password
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <span className="text-base">📊</span>
                    Dashboard
                  </Link>
                </div>

                <div className="border-t border-slate-700 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <span className="text-base">🚪</span>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;