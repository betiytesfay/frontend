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
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const role = location.state?.role || 'session'
  const handleLogin = async () => {
    setLoading(true);

    // --- Hard-coded login start ---
    const user = {
      role: role === 'session' ? 'session-admin' : 'super-admin',
      username: username
    };

    // Simulate loading delay
    setTimeout(() => {
      if (user.role === "super-admin") {
        navigate("/admin");
      } else if (user.role === "session-admin") {
        navigate("/sessionAdmin");
      } else {
        navigate("/");
      }
      setLoading(false);
    }, 500);
  };

  // const handleLogin = async () => {
  //   setLoading(true);
  //   try {
  //     const fullStudentId = `UGR-${username}`;
  //     const response = await axios.post(
  //       'https://attendance-production-d583.up.railway.app/auth/login',
  //       { student_id: fullStudentId, password },
  //       { withCredentials: true }
  //     );

  //     const user = response.data?.data?.user;
  //     console.log("Logged-in user:", user);

  //     if (!user) {
  //       console.error("No user returned from backend");
  //       return;
  //     }

  //     if (user.role === "super-admin") {
  //       navigate("/admin");
  //     } else if (user.role === "session-admin") {
  //       navigate("/sessionAdmin");
  //     } else {
  //       navigate("/");
  //     }

  //   } catch (err) {
  //     console.error("Login error:", err.response?.data || err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-100 flex flex-col gap-4">
        <div className="text-2xl">
          <BackButton to="/" label="← " />
        </div>
        <h1 className="text-2xl font-bold text-center">
          {role === 'session' ? 'Session Admin Login' : 'General Admin Login'}
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <label>Student Id:</label>
        <input
          type="text"
          placeholder="1234-16"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label>Password:</label>
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
