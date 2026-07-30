import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useBatchStore } from "../../../stores/useBatchStore";

export const BatchMobileCards = ({ paginatedBatches }) => {
  const { openEditForm, openDeleteConfirm } = useBatchStore();

  return (
    <div className="sm:hidden space-y-2">
      {paginatedBatches.map((b, index) => (
        <div key={b.id || index} className="border rounded p-3 shadow bg-white flex justify-between items-center">
          <div>
            <p className="font-semibold text-base">{b.name}</p>
            <p className="text-sm text-gray-500">
              {b.startDate} to {b.endDate || "Present"}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openEditForm(b)} className="text-[#D7B450] p-1">
              <FaEdit className="w-5 h-5" />
            </button>
            <button onClick={() => openDeleteConfirm(b)} className="text-red-500 p-1">
              <FaTrash className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
