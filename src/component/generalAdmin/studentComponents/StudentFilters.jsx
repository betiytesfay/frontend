import React from "react";
import { FaFilter } from "react-icons/fa";

export const StudentFilters = ({
  searchId,
  setSearchId,
  setIsSearchActive,
  showFilter,
  setShowFilter,
  filterName,
  setFilterName,
  filterDepartment,
  setFilterDepartment,
  filterGender,
  setFilterGender,
  applyFilter,
}) => {
  return (
    <div className="relative">
      <div className="mb-2 flex flex-row mt-2">
        <input
          type="text"
          placeholder="Student ID (0000-00)"
          value={searchId}
          onFocus={() => setIsSearchActive(true)}
          onChange={(e) => setSearchId(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={() => {
            applyFilter();
            setShowFilter(!showFilter);
          }}
          className="p-2 bg-[#D7B450] text-white rounded ml-1"
        >
          <FaFilter className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {showFilter && (
        <div className="mt-2 border p-3 rounded bg-white shadow absolute z-10 w-full sm:w-64 right-0 top-full">
          <input
            type="text"
            placeholder="Name…"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-2 text-base"
          />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-2 text-base"
          >
            <option value="">Department</option>
            <option value="Accounting">Accounting</option>
            <option value="Management">Management</option>
            <option value="Economics">Economics</option>
            <option value="Laws">Laws</option>
            <option value="other">Other</option>
          </select>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-2 text-base"
          >
            <option value="">All Gender</option>
            <option value="male">male</option>
            <option value="female">female</option>
          </select>
          <button
            onClick={() => {
              applyFilter();
              setShowFilter(false);
            }}
            className="w-full px-4 py-2 bg-[#D7B450] text-white rounded text-base hover:bg-yellow-600 transition"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};
