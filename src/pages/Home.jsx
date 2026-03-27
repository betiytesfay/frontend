// src/pages/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Home = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Single button click handler
  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  // Single login handler for both roles
  const handleLogin = () => {
    // Check credentials for General Admin
    if (username === "general" && password === "1234") {
      navigate("/general-admin");
    }
    // Check credentials for Session Admin
    else if (username === "session" && password === "1234") {
      navigate("/session-admin");
    }
    else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div
        className="relative w-[1440px] h-[1024px] bg-cover bg-center flex flex-col justify-center items-center mx-auto my-0 rounded-xl overflow-hidden shadow-2xl"
        style={{ backgroundImage: "url('/gbiphoto.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60"></div>

        <div className="relative z-10 flex flex-col items-center space-y-6 animate-fadeIn">
          <img
            src="/gibilogo.png"
            alt="Logo"
            className="w-28 h-28 mb-2 rounded-full shadow-lg"
          />

          <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-lg">
            <span className="animate-fadeSlide inline-block">
              Welcome to Gibi Attendance
            </span>
          </h1>

          <p className="text-white/80 text-center text-lg md:text-xl max-w-xl">
            Simplifying attendance tracking with speed, security, and style.
          </p>

          {/* SINGLE LOGIN BUTTON - NOT TWO */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              onClick={handleLoginClick}
              className="w-[304px] h-[49px] bg-gradient-to-r from-yellow-400 to-orange-500 
                         hover:from-yellow-500 hover:to-orange-600 text-white font-semibold rounded-md
                         transition-all duration-300 ease-linear shadow-md transform hover:scale-105 hover:shadow-xl"
            >
              Login
            </button>
          </div>

          {/* SINGLE LOGIN FORM */}
          {showLoginForm && (
            <div className="flex flex-col items-center space-y-4 mt-4">
              <div className="flex flex-col space-y-4 w-[304px]">
                <input
                  type="text"
                  placeholder="Username (general or session)"
                  className="w-full h-12 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password (1234)"
                  className="w-full h-12 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  onClick={handleLogin}
                  className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md
                        transition-all duration-300 ease-linear shadow-md transform hover:scale-105 hover:shadow-xl"
                >
                  Login
                </button>
              </div>
            </div>
          )}

          <p className="text-white mt-2 text-sm cursor-pointer hover:underline">
            Forget password?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;