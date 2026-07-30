import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useCourseStore } from "../../../stores/useCourseStore";

export const CourseMobileCards = ({ paginatedCourses }) => {
  const { openEditForm, openDeleteConfirm } = useCourseStore();

  return (
    <div className="sm:hidden space-y-2">
      {paginatedCourses.map((c, index) => (
        <div key={c.id || index} className="border rounded p-3 shadow bg-white flex justify-between items-center">
          <div>
            <p className="font-semibold text-base">{c.name}</p>
            <p className="text-sm text-gray-500">{c.description || "No description"}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openEditForm(c)} className="text-[#D7B450] p-1">
              <FaEdit className="w-5 h-5" />
            </button>
            <button onClick={() => openDeleteConfirm(c)} className="text-red-500 p-1">
              <FaTrash className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
