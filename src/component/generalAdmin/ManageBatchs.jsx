import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaExchangeAlt } from 'react-icons/fa';

const BASE = "https://gibi-backend-669108940571.us-central1.run.app";

const normalizeBatch = (raw) => {
  if (!raw) return null;
  return {
    batch_id: raw.batch_id || raw.id || raw.batchId || null,
    batch_name: raw.batch_name || raw.batch_name || raw.name || raw.batchName || '',
    start_date: raw.start_date ? (raw.start_date.split ? raw.start_date.split('T')[0] : raw.start_date) : '',
    end_date: raw.end_date ? (raw.end_date.split ? raw.end_date.split('T')[0] : raw.end_date) : '',
    is_completed: raw.is_completed ?? raw.isCompleted ?? false,
    raw,
  };
};

const ManageBatches = () => {
  const [selectedAction, setSelectedAction] = useState("");
  const [batches, setBatches] = useState([]);

  // Add/Edit fields
  const [batchName, setBatchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  // Transfer fields
  const [studentId, setStudentId] = useState("");
  const [fromBatch, setFromBatch] = useState("");
  const [toBatch, setToBatch] = useState("");
  const [transferMode, setTransferMode] = useState("single");


  const fetchBatches = async () => {
    try {
      const res = await fetch(`${BASE}/batches`, { credentials: 'include' });
      if (!res.ok) throw new Error(`Failed to fetch batches: ${res.status}`);
      const payload = await res.json();
      const list = Array.isArray(payload) ? payload : (payload.data || payload.batches || payload);
      setBatches((list || []).map(normalizeBatch));
    } catch (err) {
      console.error(err);
      setBatches([]);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleAddBatch = async () => {
    const newBatch = {
      batch_name: batchName,
      start_date: startDate || null,
      end_date: endDate || null
    };

    const res = await fetch(`${BASE}/batches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBatch),
      credentials: 'include'
    });

    if (!res.ok) return alert("Failed to add batch");

    fetchBatches();
    setBatchName("");
    setStartDate("");
    setEndDate("");
  };

  const handleEditBatch = async () => {
    const updated = {
      batch_name: batchName,
      start_date: startDate || null,
      end_date: endDate || null
    };

    const res = await fetch(`${BASE}/batches/${encodeURIComponent(selectedBatchId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
      credentials: 'include'
    });

    if (!res.ok) return alert("Failed to update batch");

    fetchBatches();
    setBatchName("");
    setStartDate("");
    setEndDate("");
    setSelectedBatchId(null);
  };

  const handleDeleteBatch = async (id) => {
    const res = await fetch(`${BASE}/batches/${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: 'include'
    });

    if (!res.ok) return alert("Failed to delete batch");

    fetchBatches();
  };

  const handleTransfer = async () => {
    if (!fromBatch || !toBatch) return alert("Select both From and To batches");

    let url = "";
    let body = {};

    if (transferMode === "single") {
      if (!studentId) return alert("Enter Student ID");
      url = `${BASE}/student/transfer`;
      body = {
        student_id: studentId,
        from_batch_id: Number(fromBatch),
        to_batch_id: Number(toBatch)
      };
    } else {
      url = `${BASE}/student/transfer-all`;
      body = {
        from_batch_id: Number(fromBatch),
        to_batch_id: Number(toBatch)
      };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: 'include'
    });

    if (!res.ok) return alert("Transfer failed");

    alert(transferMode === "single" ? "Student transferred!" : "All students transferred!");
    setStudentId("");
    setFromBatch("");
    setToBatch("");
  };


  return (
    <div className="bg-white p-6 max-w-5xl mx-auto flex flex-col justify-center gap-4 mt-8 sm:max-w-lg rounded-xl shadow-md w-full">

      {/* Action Selection */}
      {!selectedAction && (
        <>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4 mb-8">
            <h2 className="text-xl font-semibold text-center ">Select </h2>
            <button
              onClick={() => setSelectedAction("add")}
              className="flex items-center gap-2 bg-yellow-500 text-white  px-4 py-3 flex-1 rounded w-full sm:w-auto hover:bg-yellow-600 transition"
            >
              <FaPlus className="w-5 h-5" /> Add Batch
            </button>
            <button
              onClick={() => setSelectedAction("edit")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full sm:w-auto hover:bg-yellow-600 transition"

            >
              <FaEdit className="w-5 h-5" /> Edit Batch
            </button>
            <button
              onClick={() => setSelectedAction("delete")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition"
            >
              <FaTrash className="w-5 h-5" /> Delete Batch
            </button>

            <button
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition"
              onClick={() => setSelectedAction("transfer")}

            >
              <FaExchangeAlt className="w-5 h-5" /> Transfer Batch
            </button>
          </div>
        </>
      )}

      {/* Add Batch */}
      {selectedAction === "add" && (
        <>
          <h2 className="font-semibold text-lg mb-4">Add Batch</h2>

          <input
            type="text"
            placeholder="Batch Name"
            className="border px-3 py-2 rounded w-full mb-2 text-sm sm:text-base"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
          />

          <input
            type="date"
            className="border px-3 py-2 rounded w-full mb-2 text-sm sm:text-base"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="border px-3 py-2 rounded w-full mb-2 text-sm sm:text-base"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={handleAddBatch}
          >
            Save
          </button>
        </>
      )}

      {/* Edit Batch */}
      {selectedAction === "edit" && (
        <>
          <h2 className="font-semibold text-lg mb-4">Edit Batch</h2>

          <select
            className="border px-3 py-2 mb-2 rounded w-full text-sm sm:text-base"
            onChange={(e) => {
              const b = batches.find((x) => x.batch_id == e.target.value);
              setSelectedBatchId(b.batch_id);
              setBatchName(b.batch_name);
              setStartDate(b.start_date?.split("T")[0]);
              setEndDate(b.end_date?.split("T")[0] || "");
            }}
          >
            <option>Select Batch</option>
            {batches.map((b) => (
              <option key={b.batch_id} value={b.batch_id}>
                {b.batch_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="border px-3 py-2 rounded w-full mb-2 text-sm sm:text-base"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
          />

          <input
            type="date"
            className="border px-3 py-2 rounded w-full mb-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="border px-3 py-2 rounded w-full mb-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={handleEditBatch}
          >
            Update
          </button>
        </>
      )}

      {/* Delete Batch */}
      {selectedAction === "delete" && (
        <>
          <h2 className="font-semibold text-lg mb-4">Delete Batch</h2>

          {batches.map((b) => (
            <div
              key={b.batch_id}
              className="border p-3 rounded flex flex-col sm:flex-row justify-between w-full mb-2"
            >
              <span>{b.batch_name}</span>
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => handleDeleteBatch(b.batch_id)}
              >
                Delete
              </button>
            </div>
          ))}
        </>
      )}

      {/* Transfer Batch */}
      {/* Transfer Batch */}
      {selectedAction === "transfer" && (
        <>
          <h2 className="font-semibold text-lg mb-4">Transfer Students</h2>

          {/* Mode selector */}
          <div className="flex gap-4 mb-4 flex-wrap">
            <button
              className={`px-4 py-2 rounded ${transferMode === "single" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
              onClick={() => setTransferMode("single")}
            >
              Single Student
            </button>
            <button
              className={`px-4 py-2 rounded ${transferMode === "all" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
              onClick={() => setTransferMode("all")}
            >
              All Students
            </button>
          </div>

          {/* Single Student ID input */}
          {transferMode === "single" && (
            <input
              type="text"
              placeholder="Student ID"
              className="border px-3 py-2 rounded w-full mb-2 text-sm sm:text-base"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          )}

          {/* Batch selectors */}
          <select
            className="border px-3 py-2 rounded w-full mb-2 text-sm sm:text-base"
            value={fromBatch}
            onChange={(e) => setFromBatch(e.target.value)}
          >
            <option >From Batch</option>
            {batches.map((b) => (
              <option key={b.batch_id} value={b.batch_id}>{b.batch_name}</option>
            ))}
          </select>

          <select
            className="border px-3 py-2 rounded w-full mb-2 text-sm sm:text-base"
            value={toBatch}
            onChange={(e) => setToBatch(e.target.value)}
          >
            <option>To Batch</option>
            {batches.map((b) => (
              <option key={b.batch_id} value={b.batch_id}>{b.batch_name}</option>
            ))}
          </select>

          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={handleTransfer}
          >
            {transferMode === "single" ? "Transfer Student" : "Transfer All"}
          </button>
        </>
      )}

    </div>
  );
};

export default ManageBatches;
