import React from "react";
import { useUserStore } from "../../../stores/useUserStore";

export const UserModals = () => {
  const {
    selectedUser,
    showViewPopup, setShowViewPopup,
    showDeletePopup, setShowDeletePopup, deleteUser,
    showEditPopup, setShowEditPopup, editUser,
    username, setUsername,
    studentId, setStudentId,
    email, setEmail,
    role, setRole,
  } = useUserStore();

  return (
    <>
      {/* View Modal */}
      {showViewPopup && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">User Details</h2>
            <p className="mb-1"><strong>ID:</strong> {selectedUser.user_id}</p>
            <p className="mb-1"><strong>Username:</strong> {selectedUser.username}</p>
            <p className="mb-1"><strong>Email:</strong> {selectedUser.email}</p>
            <p className="mb-1"><strong>Role:</strong> {selectedUser.role}</p>
            <p className="mb-1"><strong>Student ID:</strong> {selectedUser.student_id || "N/A"}</p>
            <button
              onClick={() => setShowViewPopup(false)}
              className="w-full px-4 py-2 bg-gray-300 rounded mt-4 hover:bg-gray-400 font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeletePopup && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="font-semibold text-lg mb-2 text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete user:</p>
            <p className="font-bold mt-2 text-gray-800">{selectedUser.username}</p>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(selectedUser.user_id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditPopup && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">Edit User</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="border px-3 py-2 rounded w-full"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border px-3 py-2 rounded w-full"
              />
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Student ID"
                className="border px-3 py-2 rounded w-full"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="admin">Admin</option>
                <option value="sessionAdmin">Session Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowEditPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={editUser}
                className="px-4 py-2 bg-[#D7B450] text-white rounded hover:bg-yellow-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
