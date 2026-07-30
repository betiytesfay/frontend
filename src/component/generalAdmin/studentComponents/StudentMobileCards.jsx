import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export const StudentMobileCards = ({
  filteredStudents,
  fetchStudentAndOpenView,
  openEditForm,
  openDeleteConfirm,
}) => {
  return (
    <div className="sm:hidden">
      {filteredStudents.map((s) => (
        <div
          key={s.id}
          onClick={() => fetchStudentAndOpenView(s.id)}
          className="border rounded p-3 mb-1 flex justify-between items-center shadow bg-white cursor-pointer"
        >
          <div className="flex-1 min-w-0 mr-2">
            <p className="font-semibold truncate">
              {s.firstname} {s.lastname}
            </p>
            <p className="text-sm text-gray-500 truncate">{s.id}</p>
          </div>

          <div className="sm:hidden mt-1 flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEditForm(s);
              }}
              className="text-[#D7B450] p-1"
            >
              <FaEdit />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openDeleteConfirm(s);
              }}
              className="text-red-500 p-1"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
