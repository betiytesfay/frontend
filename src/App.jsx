import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import logo from './assets/logo.png'
import bgImage from './assets/background.png'
import './index.css'

export default function CombinedLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

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
        console.error("No user returned from backend");
        setError("Invalid credentials");
        return;
      }

      localStorage.setItem('adminId', user.student_id);
      localStorage.setItem('accessToken', response.data?.data?.accessToken || '');
      localStorage.setItem('refreshToken', response.data?.data?.refreshToken || '');
      console.log('Admin ID from localStorage:', localStorage.getItem('adminId'));

      // Navigate based on role returned from backend
      if (user.role === "super-admin") {
        navigate("/admin");
      } else if (user.role === "admin") {
        navigate("/sessionAdmin");
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

  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div
        className="flex flex-col m-5 items-center gap-6 w-[400px] p-8 backdrop-blur-md rounded-xl text-center"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
      >
        <img src={logo} alt="Logo" className="w-40 h-40 object-contain mb-4" />
        <h1 className="text-3xl md:text-2xl font-bold text-white text-center drop-shadow-lg">
          <span className="animate-fadeSlide inline-block">
            Welcome to Gibi Attendance
          </span>
        </h1>

        <div className="w-full text-left">
          <label className="text-white text-sm mb-1 block">Student ID:</label>
          <input
            type="text"
            placeholder="eg., 1234-16"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#D7B450] bg-white/90"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="w-full text-left">
          <label className="text-white text-sm mb-1 block">Password:</label>
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-[#D7B450] bg-white/90 backdrop-blur-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full border border-[#D7B450] bg-[#D7B450] text-black py-3 rounded-md text-base font-semibold transition duration-200 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="flex justify-center w-full mt-2">
          <a href="#" className="text-white text-sm hover:underline">Forgot Password?</a>
        </div>
      </div>
    </div>
  )
}