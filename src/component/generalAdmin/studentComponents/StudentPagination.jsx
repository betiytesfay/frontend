import React from "react";

export const StudentPagination = ({
  page,
  setPage,
  totalPages,
  studentsPerPage,
  setStudentsPerPage,
}) => {
  return (
    <div className="flex justify-center gap-2 mt-4 flex-wrap">
      {/* Prev */}
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className={`px-3 py-1 rounded transition ${
          page === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 hover:bg-[#D7B450] hover:text-white"
        }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`px-3 py-1 rounded transition ${
            p === page
              ? "bg-[#D7B450] text-white font-semibold"
              : "bg-gray-200 text-gray-700 hover:bg-[#D7B450] hover:text-white"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={page === totalPages}
        className={`px-3 py-1 rounded transition ${
          page === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 hover:bg-[#D7B450] hover:text-white"
        }`}
      >
        Next
      </button>

      <label className="flex items-center gap-2">
        Show:
        <select
          value={studentsPerPage}
          onChange={(e) => setStudentsPerPage(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </label>
    </div>
  );
};
