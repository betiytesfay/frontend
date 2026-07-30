import React from "react";
import { FaFilter } from "react-icons/fa";
import { useCourseStore } from "../../../stores/useCourseStore";

export const CourseFilters = () => {
  const { searchId, setSearchId, showFilter, setShowFilter, filterName, setFilterName } = useCourseStore();

  return (
    <div className="mb-2 flex flex-row mt-2 relative">
      <input
        type="text"
        placeholder="Course Name or ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="p-2 bg-[#D7B450] text-white rounded ml-1"
      >
        <FaFilter className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {showFilter && (
        <div className="mt-2 border p-3 rounded bg-white shadow absolute z-10 w-full sm:w-64 right-0 top-full">
          <input
            type="text"
            placeholder="Filter Course Name…"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-2"
          />
          <button
            onClick={() => setShowFilter(false)}
            className="w-full px-4 py-2 bg-[#D7B450] text-white rounded hover:bg-yellow-600 transition"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};
