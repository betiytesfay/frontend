import React from "react";
import { useBatchStore } from "../../../stores/useBatchStore";

export const BatchTable = ({ paginatedBatches }) => {
  const { openEditForm, openDeleteConfirm } = useBatchStore();

  return (
    <div className="hidden sm:block w-full overflow-x-auto mt-2">
      <table className="min-w-full w-full border-collapse border border-gray-200 shadow-sm rounded-lg">
        <thead className="bg-yellow-100">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Batch Name</th>
            <th className="px-4 py-2 text-left">Start Date</th>
            <th className="px-4 py-2 text-left">End Date</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBatches.map((b, index) => (
            <tr key={b.id || index} className="hover:bg-yellow-50 transition rounded-lg">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2 font-medium">{b.name}</td>
              <td className="px-4 py-2">{b.startDate || "N/A"}</td>
              <td className="px-4 py-2">{b.endDate || "N/A"}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => openEditForm(b)}
                  className="px-2 py-1 bg-[#D7B450] text-white rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteConfirm(b)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
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
