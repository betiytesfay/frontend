import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useUserStore } from "../../../stores/useUserStore";

export const UserMobileCards = ({ paginatedUsers }) => {
  const { openEditForm, openDeleteConfirm, openViewPopup } = useUserStore();

  return (
    <div className="sm:hidden space-y-2">
      {paginatedUsers.map((u, index) => (
        <div
          key={u.user_id || index}
          onClick={() => openViewPopup(u)}
          className="border rounded p-3 shadow bg-white cursor-pointer flex justify-between items-center"
        >
          <div>
            <p className="font-semibold text-base">{u.username}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
              {u.role}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); openEditForm(u); }}
              className="text-[#D7B450] p-1"
            >
              <FaEdit className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); openDeleteConfirm(u); }}
              className="text-red-500 p-1"
            >
              <FaTrash className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
