import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaExchangeAlt, FaArrowLeft, FaUserPlus, FaFilter } from 'react-icons/fa';

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

  const [searchTerm, setSearchTerm] = useState("");
  const [searchBatch, setSearchBatch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [modalBatch, setModalBatch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const batchesPerPage = 10;
  const indexOfLastBatch = currentPage * batchesPerPage;
  const indexOfFirstBatch = indexOfLastBatch - batchesPerPage;
  const currentBatches = batches
    .filter((b) => b.batch_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(indexOfFirstBatch, indexOfLastBatch);


  const [batchName, setBatchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  // Transfer fields
  const [studentId, setStudentId] = useState("");
  const [fromBatch, setFromBatch] = useState("");
  const [toBatch, setToBatch] = useState("");
  const [transferMode, setTransferMode] = useState("single");


  async function fetchBatches() {
    try {
      const res = await fetch(`${BASE}/batches`);
      const payload = await res.json();

      // Extract the batches from the data property
      const batchesData = payload?.data?.batches || [];

      console.log('BATCH LIST:', batchesData);

      const normalized = batchesData.map(batch => ({
        ...batch,
        batch_name: batch.batch_name.toUpperCase(),
      }));

      setBatches(normalized);
    } catch (err) {
      console.error(err);
    }
  }



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
  const handleEditClick = (batch) => {
    setSelectedBatchId(batch.batch_id);
    setBatchName(batch.batch_name);
    setStartDate(batch.start_date);
    setEndDate(batch.end_date);
    setShowEdit(true); // we'll define showEdit next
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
      <div className="flex items-center justify-between ">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaArrowLeft /> Back
        </button>
        <h2 className="font-extrabold text-lg">Batches</h2>
      </div>
      <div className="mb-4 flex flex-row">
        <input
          type="text"
          placeholder="Search batches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <button
          onClick={() => {
            setShowFilter(!showFilter)
          }}
          className="p-2 bg-yellow-600 rounded"
        >
          <FaFilter className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center justify-between mb-4 px-2">

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedAction("add")}
            className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
          >
            <FaUserPlus /> Add
          </button>

          <button
            onClick={() => setSelectedAction("transfer")}
            className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
          >
            Transfer
          </button>
        </div>

      </div>


      {/* Mobile Card List */}
      <div className="flex flex-col gap-2.5  sm:hidden">
        {currentBatches
          .map((b) => (
            <div
              key={b.batch_id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer flex justify-between items-center sm:hidden"
            >
              <div
                className="flex-1"
                onClick={() => setModalBatch(b)}
              >
                <h3 className="font-bold text-lg">{b.batch_name}</h3>
              </div>

              {/* Actions */}
              <div className="flex gap-2 ml-2">
                <button
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"

                  onClick={() => {
                    handleEditClick(b);
                    setSelectedAction("edit");
                  }}
                >
                  <FaEdit className="w-3 h-3" />
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  onClick={() => handleDeleteBatch(b.batch_id)}
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>

            </div>

          ))}
        {/* Mobile Modal for batch details */}
        {modalBatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-lg " onClick={(e) => e.stopPropagation()}>
              <h3 className="font-bold text-lg mb-2">{modalBatch.batch_name}</h3>
              <p><strong>Start Date:</strong> {modalBatch.start_date}</p>
              <p><strong>End Date:</strong> {modalBatch.end_date}</p>
              <p><strong>Completed:</strong> {modalBatch.is_completed ? 'Yes' : 'No'}</p>
              {/* Add any other details you want to show */}

              <div className="flex gap-2 mt-4">
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  onClick={() => {
                    handleEditClick(modalBatch);
                    setModalBatch(null);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    handleDeleteBatch(modalBatch.batch_id);
                    setModalBatch(null);
                  }}
                >
                  Delete
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setModalBatch(null)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>


      {/* Batch Table */}
      <div className="border hidden md:block rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 gap-4 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">

          <div>Name</div>
          <div>Start Date</div>
          <div>End Date</div>
          <div>Actions</div>
        </div>

        {currentBatches
          .filter((b) => b.batch_name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((b) => (
            <div key={b.batch_id} className="grid grid-cols-4 gap-4 px-4 py-3 border-t items-center text-sm">
              <div>{b.batch_name}</div>
              <div>{b.start_date}</div>
              <div>{b.end_date}</div>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                  onClick={() => {
                    handleEditClick(b);
                    setSelectedAction("edit")
                  }}
                >
                  <FaEdit className="w-3 h-3" />
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  onClick={() => handleDeleteBatch(b.batch_id)}
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>

        {/* Show page numbers */}
        {Array.from({ length: Math.ceil(batches.length / batchesPerPage) }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`px-3 py-1 rounded ${currentPage === num ? "bg-yellow-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            onClick={() => setCurrentPage(num)}
          >
            {num}
          </button>
        ))}

        <button
          className={`px-3 py-1 rounded ${indexOfLastBatch >= batches.length ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}
          disabled={indexOfLastBatch >= batches.length}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>



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
