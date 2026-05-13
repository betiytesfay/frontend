import React from "react";

const DeleteStudentModal = ({
  student = null,
  onClose = () => { },
  onConfirm = () => { },
}) => {
  if (!student) return null;

  const handleConfirm = () => {
    onConfirm(student.id);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-80">
        <h2 className="text-lg font-bold">
          Confirm Delete
        </h2>

        <p className="mt-2">
          Delete {student.firstname} {student.lastname}?
        </p>

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStudentModal;