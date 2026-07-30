import React from "react";
import { useBatchStore } from "../../../stores/useBatchStore";

export const BatchModals = () => {
  const {
    selectedBatch,
    batchName, setBatchName,
    startDate, setStartDate,
    endDate, setEndDate,
    showAddPopup, setShowAddPopup, addBatch,
    showEditPopup, setShowEditPopup, editBatch,
    showDeletePopup, setShowDeletePopup, deleteBatch,
  } = useBatchStore();

  return (
    <>
      {/* Add Modal */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">Add New Batch</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Batch Name:</label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="Batch Name"
                  className="border px-3 py-2 rounded w-full mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border px-3 py-2 rounded w-full mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border px-3 py-2 rounded w-full mt-1"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowAddPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={addBatch}
                className="px-4 py-2 bg-[#D7B450] text-white rounded hover:bg-yellow-600 transition"
              >
                Add Batch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditPopup && selectedBatch && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">Edit Batch</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Batch Name:</label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="Batch Name"
                  className="border px-3 py-2 rounded w-full mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border px-3 py-2 rounded w-full mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border px-3 py-2 rounded w-full mt-1"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowEditPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={editBatch}
                className="px-4 py-2 bg-[#D7B450] text-white rounded hover:bg-yellow-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeletePopup && selectedBatch && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="font-semibold text-lg mb-2 text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete batch:</p>
            <p className="font-bold mt-2 text-gray-800">{selectedBatch.name}</p>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteBatch(selectedBatch.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
