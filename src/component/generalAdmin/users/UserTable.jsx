import React from "react";
import { useUserStore } from "../../../stores/useUserStore";

export const UserTable = ({ paginatedUsers }) => {
  const { openEditForm, openDeleteConfirm, openViewPopup } = useUserStore();

  return (
    <div className="hidden sm:block w-full overflow-x-auto mt-2">
      <table className="min-w-full w-full border-collapse border border-gray-200 shadow-sm rounded-lg">
        <thead className="bg-yellow-100">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Student ID</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((u, index) => (
            <tr
              key={u.user_id || index}
              className="hover:bg-yellow-50 transition rounded-lg cursor-pointer"
              onClick={() => openViewPopup(u)}
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2 font-medium">{u.username}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.role}</td>
              <td className="px-4 py-2">{u.student_id || "N/A"}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); openEditForm(u); }}
                  className="px-2 py-1 bg-[#D7B450] text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); openDeleteConfirm(u); }}
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
  );
};
