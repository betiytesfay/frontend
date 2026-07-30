import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

export const StudentActionCards = ({
  selectedAction,
  paginatedStudents,
  students,
  searchId,
  setSearchId,
  fetchStudentById,
  showFilter,
  setShowFilter,
  filterName,
  setFilterName,
  filterDepartment,
  setFilterDepartment,
  applyFilter,
  openEditForm,
  openDeleteConfirm,
  fetchStudentAndOpenView,
}) => {
  if (selectedAction === "edit") {
    return (
      <div className="w-full p-1">
        {/* Search Bar */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <input
              type="text"
              placeholder="Search by ID…"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="border px-2 py-1 rounded w-32 sm:w-4"
            />
            <button
              onClick={() => fetchStudentById(searchId)}
              className="p-2 bg-blue-600 text-white rounded flex items-center justify-center"
            >
              <FaSearch className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="p-2 bg-gray-200 rounded flex items-center justify-center"
            >
              <FaFilter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Overlay */}
        {showFilter && (
          <div className="mt-3 border p-3 rounded bg-white shadow">
            <input
              type="text"
              placeholder="Name…"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-2"
            >
              <option value="">Department</option>
              <option value="Accounting">Accounting</option>
              <option value="Computer Science">Computer Science</option>
            </select>
            <button
              onClick={applyFilter}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded"
            >
              Apply
            </button>
          </div>
        )}

        {/* Cards */}
        <div className="mt-4 space-y-4 w-full max-w-full overflow-hidden">
          {paginatedStudents.map((s) => (
            <div key={s.id} className="border rounded p-3 shadow bg-white w-full wrap-break-words">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>ID: {s.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-blue-600" onClick={() => openEditForm(s)}>
                    Edit
                  </button>
                  <button className="text-red-600" onClick={() => openDeleteConfirm(s)}>
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2 text-lg">
                <p>Name: {s.firstname} {s.lastname}</p>
                <p>Department: {s.department}</p>
                <p>Phone: {s.phone}</p>
                <p>Gender: {s.gender}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedAction === "view" && students.length > 0) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        {paginatedStudents.map((s) => (
          <div
            key={s.id}
            className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="font-semibold">ID: {s.id}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchStudentAndOpenView(s.id)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => openEditForm(s)}
                  className="px-2 py-1 bg-[#D7B450] text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteConfirm(s)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span><strong>Name:</strong> {s.firstname} {s.lastname}</span>
              <span><strong>Department:</strong> {s.department}</span>
              <span><strong>Phone:</strong> {s.phone}</span>
              <span><strong>Gender:</strong> {s.gender}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
