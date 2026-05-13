import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const StudentMobileCard = ({
  student = {},
  onView = () => { },
  onEdit = () => { },
  onDelete = () => { },
}) => {
  const handleView = () => {
    onView(student);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(student);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(student);
  };

  return (
    <div
      onClick={handleView}
      className="border rounded p-3 mb-2 shadow bg-white cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">
            {student.firstname} {student.lastname}
          </p>

          <p className="text-sm text-gray-500">
            {student.id}
          </p>

          <p className="text-sm text-gray-500">
            {student.department}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="text-[#D7B450]"
          >
            <FaEdit />
          </button>

          <button
            onClick={handleDelete}
            className="text-red-500"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentMobileCard;