import React, { useState, useEffect } from "react";
import { FaUserPlus, FaUserEdit, FaUserMinus, FaUserCircle } from 'react-icons/fa';
const BASE = "https://attendance-production-d583.up.railway.app";
const ManageUser = () => {
  const [selectedAction, setSelectedAction] = useState("");
  const [users, setUsers] = useState([]);

  // form fields
  const [username, setUsername] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const normalizeUser = (raw) => {
    if (!raw) return null;
    return {
      user_id: raw.user_id || raw.id || raw.userId || null,
      username: raw.username || raw.name || raw.user || '',
      email: raw.email || raw.email_address || '',
      role: raw.role || 'admin',
      student_id: raw.student_id || raw.studentId || null,
      raw,
    };
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE}/user`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include'
      });

      if (!res.ok) {
        console.error('fetchUsers failed', res.status);
        setUsers([]);
        return;
      }

      const payload = await res.json();
      const list = Array.isArray(payload) ? payload : (payload.data || payload.users || []);
      setUsers((list || []).map(normalizeUser));
    } catch (err) {
      console.error('fetchUsers error', err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const clearForm = () => {
    setUsername("");
    setStudentId("");
    setPassword("");
    setRole("admin");
    setEmail("");
    setSelectedUserId(null);
  };

  const handleAddUser = async () => {
    const payload = {
      username,
      student_id: studentId,
      password,
      role,
      email
    };

    const res = await fetch(`${BASE}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: 'include'
    });

    if (!res.ok) return alert("Failed to add user");

    // refresh canonical list
    await fetchUsers();
    clearForm();
  };

  const handleEditUser = async () => {
    const payload = {
      username,
      student_id: studentId,
      password: password || undefined,
      role,
      email
    };

    try {
      const res = await fetch(`${BASE}/user/${encodeURIComponent(selectedUserId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!res.ok) {
        let body = '<no body>';
        try { body = await res.text(); } catch (e) { }
        console.error('Edit user failed', res.status, body);
        return alert('Failed to update user');
      }

      await fetchUsers();
      clearForm();
    } catch (err) {
      console.error('Edit user error', err);
      alert('Could not connect to backend');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`${BASE}/user/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      });

      if (!res.ok) {
        let body = '<no body>';
        try { body = await res.text(); } catch (e) { }
        console.error('Delete user failed', res.status, body);
        return alert('Failed to delete user');
      }

      await fetchUsers();
    } catch (err) {
      console.error('Delete user error', err);
      alert('Could not connect to backend');
    }
  };

  return (
    <div className="bg-white p-6   max-w-5xl mx-auto flex flex-col justify-center gap-4 mt-8  sm:max-w-lg rounded-xl shadow-md w-full">

      {/* action selection */}
      {!selectedAction && (

        <>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4 mb-8">
            <h2 className="text-xl font-semibold text-center ">Select </h2>
            <button
              onClick={() => setSelectedAction("add")}
              className="flex items-center gap-2 bg-yellow-500 text-white  px-4 py-3 flex-1 rounded w-full sm:w-auto hover:bg-yellow-600 transition"
            >
              <FaUserPlus className="w-5 h-5" /> Add User
            </button>
            <button
              onClick={() => setSelectedAction("edit")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full sm:w-auto hover:bg-yellow-600 transition"

            >
              <FaUserEdit className="w-5 h-5" /> Edit User
            </button>
            <button
              onClick={() => setSelectedAction("delete")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition"
            >
              <FaUserMinus className="w-5 h-5" /> Delete User
            </button>

            <button
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition"
              onClick={() => setSelectedAction("view")}

            >
              <FaUserCircle className="w-5 h-5" /> View Users
            </button>
          </div>
        </>
      )}

      {/* Add User */}
      {selectedAction === "add" && (
        <>
          <h2 className="font-semibold text-lg mb-4">Add User</h2>

          <input
            type="text"
            placeholder="Username"
            className="border px-3 py-2 rounded w-full mb-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="text"
            placeholder="Student ID"
            className="border px-3 py-2 rounded w-full mb-2"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border px-3 py-2 rounded w-full mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="border px-3 py-2 rounded w-full mb-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>

          <input
            type="email"
            placeholder="Email"
            className="border px-3 py-2 rounded w-full mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={handleAddUser}
          >
            Save
          </button>
        </>
      )}

      {/* Edit User */}
      {selectedAction === "edit" && (
        <>
          <h2 className="font-semibold text-lg mb-4">Edit User</h2>

          <select
            className="border px-3 py-2 rounded w-full mb-2"
            onChange={(e) => {
              const u = users.find((x) => x.user_id == e.target.value);
              setSelectedUserId(u.user_id);
              setUsername(u.username);
              setStudentId(u.student_id);
              setRole(u.role);
              setEmail(u.email);
              setPassword(""); // optional reset
            }}
          >
            <option>Select User</option>
            {users.map((u) => (
              <option key={u.user_id} value={u.user_id}>
                {u.username}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Username"
            className="border px-3 py-2 rounded w-full mb-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="text"
            placeholder="Student ID"
            className="border px-3 py-2 rounded w-full mb-2"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password (optional)"
            className="border px-3 py-2 rounded w-full mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="border px-3 py-2 rounded w-full mb-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>

          <input
            type="email"
            placeholder="Email"
            className="border px-3 py-2 rounded w-full mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={handleEditUser}
          >
            Update
          </button>
        </>
      )}

      {/* Delete User */}
      {selectedAction === "delete" && (
        <>
          <h2 className="font-semibold text-lg mb-4">Delete User</h2>

          {users.map((u) => (
            <div
              key={u.user_id}
              className="border p-3 rounded flex justify-between mb-2"
            >
              <span>{u.username}</span>
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => handleDeleteUser(u.user_id)}
              >
                Delete
              </button>
            </div>
          ))}
        </>
      )}

      {/* View Users */}
      {selectedAction === "view" && users.length > 0 && (
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="font-semibold text-lg mb-4">{selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)} User</h2>

          {users.map((user) => (
            <div
              key={user.user_id}
              className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
            >
              {/* Top row: Checkbox, ID, Actions */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-semibold">ID: {user.user_id}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedUserId(user.user_id);
                      setShowViewPopup(true);
                    }}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      setSelectedUserId(user.user_id);
                      setUsername(user.username);
                      setStudentId(user.student_id);
                      setRole(user.role);
                      setEmail(user.email);
                      setShowEditPopup(true);
                    }}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedUserId(user.user_id);
                      setShowDeletePopup(true);
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* User details */}
              <div className="flex flex-col gap-1 mt-2">
                <span><strong>Username:</strong> {user.username}</span>
                <span><strong>Email:</strong> {user.email}</span>
                <span><strong>Role:</strong> {user.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}


      {showViewPopup &&
        selectedUserId && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

            <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
              <h2 className="font-semibold text-lg mb-4">Admin Info</h2>

              {users
                .filter((u) => u.user_id === selectedUserId)
                .map((user) => (
                  <div key={user.user_id} className="flex flex-col gap-1">
                    <p><strong>ID:</strong> {user.user_id}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                  </div>
                ))}

              <button
                onClick={() => setShowViewPopup(false)}
                className="w-full px-4 py-2 bg-gray-300 rounded mt-4"
              >
                Close
              </button>
            </div>
          </div>
        )}

    </div>
  );
};

export default ManageUser;
