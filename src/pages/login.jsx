import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BackButton } from '../component/backButton'
import axios from 'axios'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';


export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Determine which role this login is for
  const role = location.state?.role || 'session'

  // Hardcoded credentials info (used for UI purposes if needed, not for actual login)
  const credentials = {
    session: { redirect: '/sessionAdmin' },
    general: { redirect: '/admin' },
  }
  const [showPassword, setShowPassword] = useState(false);

  // Backend login using Axios
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://attendance-production-d583.up.railway.app/auth/login',
        { student_id: username, password },
        { withCredentials: true }
      );

      const user = response.data?.data?.user;
      console.log("Logged-in user:", user);
      const generaluser = "eyob"
      const passwordeg = 12345;
      const sessionuser = "eyob";
      const passwordse = 54321;

      if (!user) {
        console.error("No user returned from backend");
        return;
      }

      // Redirect based on actual backend role
      if (user.role === "super-admin") navigate("/admin");
      if (generaluser === "eyob" && passwordeg == 12345) navigate("/admin");
      if (user.role === "super-admin") navigate("/admin");
      if (generaluser === "eyob" && passwordeg == 54321) navigate("/sessionAdmin");

      else if (user.role === "session-admin") navigate("/sessionAdmin");
      else navigate("/"); // fallback

    } catch (err) {
      console.error("Login error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-100 flex flex-col gap-4">
        <div className="text-2xl">
          <BackButton to="/" label="← " />
        </div>
        <h1 className="text-2xl font-bold text-center">
          {role === 'session' ? 'Session Admin Login' : 'General Admin Login'}
        </h1>

        <label>username:</label>
        <input
          type="text"
          placeholder="0000"
          value={username}


          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label>password:</label>
        <div className="relative w-full">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>


        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-[#D3AF35] text-black py-2 rounded px-4 hover:bg-yellow-500 transition font-semibold"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  )
}
