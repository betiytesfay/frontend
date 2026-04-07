// src/component/AttendanceFilter.jsx
export default function AttendanceFilter({
  presentCount,
  absentCount,
  filterPresent,
  filterAbsent,
  setFilterPresent,
  setFilterAbsent,
  sessions,
  selectedBatch,
  setSelectedBatch,
  selectedDepartment,
  setSelectedDepartment
}) {
  // All unique batch names from all sessions (for dropdown)
  const batches = Array.from(new Set(sessions.map(s => s.batchName))).filter(Boolean);

  // All unique departments from all students
  const departments = Array.from(
    new Set(sessions.flatMap(session => session.students.map(s => s.department)))
  ).filter(Boolean);

  return (
    <div className="mt-4 flex gap-2 flex-wrap">
      {/* Batch filter */}
      <select
        value={selectedBatch || ""}
        onChange={(e) => setSelectedBatch(e.target.value || null)}
        className="px-3 py-1 text-sm rounded border"
      >
        <option value="">All Batches</option>
        {batches.map(batch => (
          <option key={batch} value={batch}>{batch}</option>
        ))}
      </select>

      {/* Department filter */}
      <select
        value={selectedDepartment || ""}
        onChange={(e) => setSelectedDepartment(e.target.value || null)}
        className="px-3 py-1 text-sm rounded border"
      >
        <option value="">All Departments</option>
        {departments.map(dept => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>

      {/* Present button */}
      <button
        onClick={() => {
          setFilterPresent(!filterPresent);
          setFilterAbsent(false);
        }}
        className={`px-3 py-1 text-sm rounded ${filterPresent ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
      >
        Present ({presentCount})
      </button>

      {/* Absent button */}
      <button
        onClick={() => {
          setFilterAbsent(!filterAbsent);
          setFilterPresent(false);
        }}
        className={`px-3 py-1 text-sm rounded ${filterAbsent ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
      >
        Absent ({absentCount})
      </button>

      {/* Clear all filters */}
      {(filterPresent || filterAbsent || selectedBatch || selectedDepartment) && (
        <button
          onClick={() => {
            setFilterPresent(false);
            setFilterAbsent(false);
            setSelectedBatch(null);
            setSelectedDepartment(null);
          }}
          className="px-3 py-1 text-sm rounded bg-yellow-400 text-black"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}