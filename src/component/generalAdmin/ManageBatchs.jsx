import React, { useEffect } from "react";
import { FaGraduationCap, FaPlus, FaArrowLeft } from "react-icons/fa";
import { useBatchStore } from "../../stores/useBatchStore";
import { BatchFilters } from "./batches/BatchFilters";
import { BatchTable } from "./batches/BatchTable";
import { BatchMobileCards } from "./batches/BatchMobileCards";
import { BatchModals } from "./batches/BatchModals";
import { StudentPagination } from "./studentComponents/StudentPagination";

const ManageBatchs = ({ setSelectedCategory }) => {
  const {
    batches,
    fetchBatches,
    selectedAction,
    setSelectedAction,
    page, setPage,
    filterName, searchId,
    setShowAddPopup,
    clearForm,
  } = useBatchStore();

  useEffect(() => {
    fetchBatches();
  }, []);

  const itemsPerPage = 10;
  const filtered = batches.filter(b => {
    const matchName = !filterName || b.name.toLowerCase().includes(filterName.toLowerCase());
    const matchSearch = !searchId || b.name.toLowerCase().includes(searchId.toLowerCase()) || String(b.id).includes(searchId);
    return matchName && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedBatches = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleBack = () => {
    clearForm();
    if (selectedAction) {
      setSelectedAction("");
    } else if (setSelectedCategory) {
      setSelectedCategory("");
    } else {
      fetchBatches();
    }
  };

  return (
    <div className="bg-white p-3 sm:p-5 md:p-6 w-full max-w-full mx-auto flex flex-col gap-3 mt-2 sm:mt-4 md:mt-8 rounded-xl shadow-md overflow-x-hidden min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          <FaArrowLeft />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <FaGraduationCap /> Manage Batches
        </h2>
        <button
          onClick={() => setShowAddPopup(true)}
          className="flex items-center gap-1 bg-[#D7B450] text-white px-3 py-2 rounded hover:bg-yellow-600 transition"
        >
          <FaPlus />
          <span className="hidden sm:inline">Add Batch</span>
        </button>
      </div>

      {/* Main Content */}
      <BatchFilters />
      <BatchTable paginatedBatches={paginatedBatches} />
      <BatchMobileCards paginatedBatches={paginatedBatches} />
      <StudentPagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        studentsPerPage={itemsPerPage}
        setStudentsPerPage={() => {}}
      />

      {/* Popups */}
      <BatchModals />
    </div>
  );
};

export default ManageBatchs;
