import React, { useState, useEffect } from "react";

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
    const res = await fetch("https://attendance-production-d583.up.railway.app/batch");
    const data = await res.json();
    setBatches(data);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleAddBatch = async () => {
    const newBatch = {
      batch_name: batchName,
      start_date: new Date(startDate),
      end_date: endDate ? new Date(endDate) : null
    };

    const res = await fetch("https://attendance-production-d583.up.railway.app/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBatch)
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
      start_date: new Date(startDate),
      end_date: endDate ? new Date(endDate) : null
    };

    const res = await fetch(
      `https://attendance-production-d583.up.railway.app/batch/${selectedBatchId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      }
    );

    if (!res.ok) return alert("Failed to update batch");

    fetchBatches();
    setBatchName("");
    setStartDate("");
    setEndDate("");
    setSelectedBatchId(null);
  };

  const handleDeleteBatch = async (id) => {
    const res = await fetch(
      `https://attendance-production-d583.up.railway.app/batch/${id}`,
      {
        method: "DELETE"
      }
    );

    if (!res.ok) return alert("Failed to delete batch");

    fetchBatches();
  };

  const handleTransfer = async () => {
    if (!fromBatch || !toBatch) return alert("Select both From and To batches");

    let url = "";
    let body = {};

    if (transferMode === "single") {
      if (!studentId) return alert("Enter Student ID");
      url = "https://attendance-production-d583.up.railway.app/student/transfer";
      body = {
        student_id: studentId,
        from_batch_id: Number(fromBatch),
        to_batch_id: Number(toBatch)
      };
    } else {
      url = "https://attendance-production-d583.up.railway.app/student/transfer-all";
      body = {
        from_batch_id: Number(fromBatch),
        to_batch_id: Number(toBatch)
      };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) return alert("Transfer failed");

    alert(transferMode === "single" ? "Student transferred!" : "All students transferred!");
    setStudentId("");
    setFromBatch("");
    setToBatch("");
  };


  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg max-w-4xl mx-auto">

      {/* Action Selection */}
      {!selectedAction && (
        <div className="flex flex-col gap-4 bg-white p-4 rounded shadow max-w-full sm:max-w-2xl">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => setSelectedAction("add")}
          >
            Add Batch
          </button>

          <button
            className="bg-yellow-500 text-white px-4 py-2  rounded"
            onClick={() => setSelectedAction("edit")}
          >
            Edit Batch
          </button>

          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => setSelectedAction("delete")}
          >
            Delete Batch
          </button>

          <button
            className="bg-yellow-500 text-white px-4 py-2  rounded"
            onClick={() => setSelectedAction("transfer")}
          >
            Transfer Batch
          </button>
        </div>
      )}

      {/* Add Batch */}
      {selectedAction === "add" && (
        <div className="mt-4 bg-white p-4 rounded shadow">
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
        </div>
      )}

      {/* Edit Batch */}
      {selectedAction === "edit" && (
        <div className="mt-4 bg-white p-4 rounded shadow">
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
        </div>
      )}

      {/* Delete Batch */}
      {selectedAction === "delete" && (
        <div className="mt-4 bg-white p-4 rounded shadow">
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
        </div>
      )}

      {/* Transfer Batch */}
      {/* Transfer Batch */}
      {selectedAction === "transfer" && (
        <div className="mt-4 bg-white p-4 rounded shadow">
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
            <option>From Batch</option>
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
        </div>
      )}

    </div>
  );
};

export default ManageBatches;
