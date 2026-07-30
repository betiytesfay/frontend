import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUserStore } from "../../../stores/useUserStore";

export const UserAddForm = () => {
  const {
    username, setUsername,
    studentId, setStudentId,
    password, setPassword,
    role, setRole,
    email, setEmail,
    showPassword, setShowPassword,
    addUser,
  } = useUserStore();

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold mb-4 text-lg text-gray-800">Add New User</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">Username:</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded h-10 px-3 w-full bg-white"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email:</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded h-10 px-3 w-full bg-white"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Student ID:</label>
          <input
            type="text"
            placeholder="UGR-1234-16"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border rounded h-10 px-3 w-full bg-white"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded h-10 px-3 w-full bg-white"
          >
            <option value="admin">Admin</option>
            <option value="sessionAdmin">Session Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <div className="sm:col-span-2 relative">
          <label className="text-sm font-medium">Password:</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded h-10 px-3 w-full bg-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={addUser}
          className="bg-[#D7B450] text-white px-5 py-2 rounded font-medium hover:bg-yellow-600 transition"
        >
          Save User
        </button>
      </div>
    </div>
  );
};
