import { useState } from 'react'
import bgpicture from './assets/sessionAdminBg.png' // replace with your session admin background
import { BackButton } from './component/backButton'


export default function UserPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const correctUsername = 'SessionAdmin'
  const correctPassword = '54321'

  const handleLogin = () => {
    if (username === correctUsername && password === correctPassword) {
      setIsLoggedIn(true)
      alert('Session Admin login successful!')
    } else {
      setIsLoggedIn(false)
      alert('Invalid username or password')
    }
  }

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${bgpicture})` }}
    >
      <BackButton />
      <div className="absolute inset-0 bg-black/40">

      </div>

      {!isLoggedIn ? (
        <div className="relative bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg flex flex-col items-center w-80">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Session Admin Login</h1>

          <div className="flex flex-col gap-3 w-full">
            <label className="font-medium text-gray-700 text-left">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
            />

            <label className="font-medium text-gray-700 text-left">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />

            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600 transition"
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className="relative bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg text-center">

          <h1 className="text-3xl font-bold text-black mb-4">
            Welcome, Session Admin!
          </h1>
          <p className="text-gray-700">You’ve successfully logged in to your dashboard.</p>
        </div>
      )}
    </div>
  )
}
















