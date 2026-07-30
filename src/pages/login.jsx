import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.png';
import bgImage from '../assets/background.png';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const fullStudentId = `UGR-${username}`;
      const response = await axios.post(
        'https://gibi-backend-669108940571.us-central1.run.app/auth/login',
        { student_id: fullStudentId, password },
        { withCredentials: true }
      );

      const user = response.data?.data?.user;
      if (!user) {
        setError("Invalid credentials");
        return;
      }

      localStorage.setItem('adminId', user.student_id);
      localStorage.setItem('accessToken', response.data?.data?.accessToken || '');
      localStorage.setItem('refreshToken', response.data?.data?.refreshToken || '');

      if (user.role === "super-admin") {
        navigate("/admin");
      } else if (user.role === "admin") {
        navigate("/sessionPage");
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError(`Login Error: ${err.response.data.message || err.message}`);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role) => {
    localStorage.setItem('adminId', `DEMO-${role.toUpperCase()}`);
    if (role === 'admin') navigate('/admin');
    else if (role === 'session') navigate('/sessionPage');
    else navigate('/attendance');
  };

  return (
    <div
      className="min-h-screen w-screen flex justify-center items-center bg-cover bg-center bg-no-repeat p-4 relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div className="relative z-10 flex flex-col items-center gap-3 w-full max-w-[380px] p-5 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl text-center shadow-2xl text-white">
        <img src={logo} alt="Logo" className="w-20 h-20 object-contain drop-shadow-md" />
        
        <h1 className="text-xl font-bold tracking-tight text-white drop-shadow">
          Gibi Attendance System
        </h1>

        <div className="w-full text-left space-y-1">
          <label className="text-xs font-semibold text-gray-100">Student ID:</label>
          <input
            type="text"
            placeholder="e.g. 1234-16"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-white/30 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#D7B450] bg-white/90 text-gray-800 text-sm shadow-inner"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="w-full text-left space-y-1">
          <label className="text-xs font-semibold text-gray-100">Password:</label>
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-white/30 rounded-lg px-3 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-[#D7B450] bg-white/90 text-gray-800 text-sm shadow-inner"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-red-300 text-xs text-center font-medium">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#D7B450] text-gray-900 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-yellow-400 transition active:scale-[0.98] disabled:opacity-50 mt-1"
        >
          {loading ? 'Logging in...' : 'Sign In'}
        </button>

        {/* Demo Fast Access / Bypass Section */}
        <div className="w-full border-t border-white/20 pt-3 mt-1 space-y-2">
          <p className="text-xs text-gray-200 font-medium">⚡ Fast Test Access (No Password):</p>
          <div className="flex gap-2">
            <button
              onClick={() => demoLogin('admin')}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs py-1.5 rounded-md border border-white/40 transition font-medium"
            >
              👑 Admin Demo
            </button>
            <button
              onClick={() => demoLogin('session')}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs py-1.5 rounded-md border border-white/40 transition font-medium"
            >
              👤 Session Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
