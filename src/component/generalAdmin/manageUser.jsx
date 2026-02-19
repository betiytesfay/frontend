import React, { useState, useEffect } from "react";
import { FaUserPlus, FaEye, FaEyeSlash, FaUserEdit, FaEdit, FaTrash, FaUserMinus, FaUserCircle, FaArrowLeft, FaFilter } from 'react-icons/fa';
const BASE = "https://gibi-backend-669108940571.us-central1.run.app";
const ManageUser = () => {
  const [selectedAction, setSelectedAction] = useState("");
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  // form fields
  const [username, setUsername] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false); const [searchId, setSearchId] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);


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
  const fetchUserById = async () => {
    try {
      const res = await fetch(`${BASE}/user/${encodeURIComponent(searchId)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      console.log("Fetched user by ID:", data);
    } catch (err) {
      console.error("Error fetching user by ID:", err);
    }
  }

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
      password_hash: password,
      role,
      email
    };

    const res = await fetch(`${BASE}/user/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: 'include'
    });

    if (!res.ok) return alert("Failed to add user");

    await fetchUsers();
    clearForm();
    setSelectedAction("");

  };
  const fetchUserAndOpenView = (id) => {
    setSelectedUserId(id);
    setShowViewPopup(true);
  };

  const openEditForm = (user) => {
    setSelectedUserId(user.user_id);
    setUsername(user.username);
    setStudentId(user.student_id);
    setEmail(user.email);
    setRole(user.role);
    setSelectedAction("edit");
  };

  const openDeleteConfirm = (user) => {
    setSelectedUserId(user.user_id);
    setSelectedAction("delete");
  };

  const handleEditUser = async () => {
    const payload = {
      username,
      student_id: studentId,
      password_hash: password || undefined,
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
      setSelectedAction("");
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
      <div className="flex flex-col gap-3 mb-4 px-2">
        <div className="flex-1 gap-2 flex items-center">
          <input
            type="text"
            placeholder="Enter Id(0000-00)"
            value={searchId}
            onFocus={() => setIsSearchActive(true)}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUserById()}
            className="flex-1 border rounded px-3 py-2 pr-10"
          />


          <button
            onClick={() => {
              setShowFilter(!showFilter)
            }}
            className="p-2 bg-yellow-600 rounded"
          >
            <FaFilter className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            <FaArrowLeft /> Back
          </button>
          <h2 className="font-bold text-lg">Admins</h2>
          <button
            onClick={() => setSelectedAction("add")}
            className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
          >
            <FaUserPlus /> Add
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-2 px-2">
        {/* PC Table View */}
        <div className="hidden sm:block w-full  overflow-x-auto mt-2">
          <table className="min-w-full w-full border-collapse border border-gray-200 shadow-sm rounded-lg">
            <thead className="bg-yellow-100">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">student_id</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Actions</th>

              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((s, index) => (
                <tr
                  key={s.user_idid}
                  className="hover:bg-yellow-50 transition rounded-lg cursor-pointer"
                  onClick={() => fetchUserAndOpenView(s.user_id)}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{s.username}</td>
                  <td className="px-4 py-2">{s.student_id}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">{s.role}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditForm(s); }}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openDeleteConfirm(s); }}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sm:hidden ">
          {paginatedUsers.map((s) => (
            <div
              key={s.user_id}
              onClick={() => fetchUserAndOpenView(s.user_id)}
              className="border rounded-lg p-3 gap-2 flex justify-between items-center shadow bg-white cursor-pointer"
            >

              <div className="gap-2">
                <p className="font-semibold">{s.username}</p>
                <p className="text-sm text-gray-500">{s.student_id}</p>
              </div>

              {/* Right: Edit / Delete */}
              <div className="sm:hidden mt-2 flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); openEditForm(s); }} className="text-yellow-500">
                  <FaEdit />
                </button>
                <button onClick={(e) => { e.stopPropagation(); openDeleteConfirm(s); }} className="text-red-500">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-4 flex-wrap">

          {/* Prev */}
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded transition
            ${page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-yellow-400"}
          `}
          >
            Prev
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded transition
              ${p === page
                  ? "bg-yellow-500 text-white font-semibold"
                  : "bg-gray-200 text-gray-700 hover:bg-yellow-400"}
            `}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded transition
            ${page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-yellow-400"}
          `}
          >
            Next
          </button>

        </div>
      </div>

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

          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded p-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <FaEye className="h-5 w-5" />
              ) : (
                <FaEyeSlash className="h-5 w-5" />
              )}
            </button>
          </div>

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
              setPassword("");
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
      {/* Delete Confirmation */}
      {selectedAction === "delete" && selectedUserId && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="font-semibold text-lg mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete user:{" "}
              <span className="font-bold">
                {users.find(u => u.user_id === selectedUserId)?.username}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setSelectedAction(""); // close popup
                  setSelectedUserId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={async () => {
                  await handleDeleteUser(selectedUserId);
                  setSelectedAction(""); // close popup after deletion
                  setSelectedUserId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
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
