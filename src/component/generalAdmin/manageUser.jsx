import React, { useState, useEffect } from "react";

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

  const baseURL = "https://attendance-production-d583.up.railway.app";

  const fetchUsers = async () => {
    const res = await fetch(`${baseURL}/user`);
    const data = await res.json();
    setUsers(data);
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

    const res = await fetch(`${baseURL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) return alert("Failed to add user");

    fetchUsers();
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

    const res = await fetch(`${baseURL}/user/${selectedUserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) return alert("Failed to update user");

    fetchUsers();
    clearForm();
  };

  const handleDeleteUser = async (id) => {
    const res = await fetch(`${baseURL}/user/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) return alert("Failed to delete user");

    fetchUsers();
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto">

      {/* action selection */}
      {!selectedAction && (
        <div className="flex flex-col gap-4 bg-white p-4 rounded shadow max-w-sm mx-auto">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => setSelectedAction("add")}
          >
            Add User
          </button>

          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => setSelectedAction("edit")}
          >
            Edit User
          </button>

          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => setSelectedAction("delete")}
          >
            Delete User
          </button>

          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => setSelectedAction("view")}
          >
            View Users
          </button>
        </div>
      )}

      {/* Add User */}
      {selectedAction === "add" && (
        <div className="mt-4 bg-white p-4 rounded shadow">
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
        </div>
      )}

      {/* Edit User */}
      {selectedAction === "edit" && (
        <div className="mt-4 bg-white p-4 rounded shadow">
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
        </div>
      )}

      {/* Delete User */}
      {selectedAction === "delete" && (
        <div className="mt-4 bg-white p-4 rounded shadow">
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
        </div>
      )}

      {/* View Users */}
      {selectedAction === "view" && (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-4">All Users</h2>

          {users.map((u) => (
            <div key={u.user_id} className="border p-3 rounded mb-2">
              <p><b>Username:</b> {u.username}</p>
              <p><b>Student ID:</b> {u.student_id}</p>
              <p><b>Email:</b> {u.email}</p>
              <p><b>Role:</b> {u.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUser;
