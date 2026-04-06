export default function AttendanceFilter({
  presentCount,
  absentCount,
  filterPresent,
  filterAbsent,
  setFilterPresent,
  setFilterAbsent,
  sessions,           // pass backendSessions
  selectedBatch,      // state from parent
  setSelectedBatch,   // setter from parent
  selectedCourse,     // state from parent
  setSelectedCourse   // setter from parent
}) {
  // get unique batches & courses
  const batches = Array.from(new Set(sessions.map(s => s.batchName)));
  const courses = Array.from(new Set(sessions.map(s => s.courseName)));

  return (
    <div className="mt-4 flex gap-2 flex-wrap">

      {/* BATCH FILTER */}
      <select
        value={selectedBatch || ""}
        onChange={(e) => setSelectedBatch(e.target.value || null)}
        className="px-3 py-1 text-sm rounded border"
      >
        <option value="">All Batches</option>
        {batches.map(batch => (
          <option key={batch} value={batch}>
            {batch}
          </option>
        ))}
      </select>

      {/* COURSE FILTER */}
      <select
        value={selectedCourse || ""}
        onChange={(e) => setSelectedCourse(e.target.value || null)}
        className="px-3 py-1 text-sm rounded border"
      >
        <option value="">All Courses</option>
        {courses.map(course => (
          <option key={course} value={course}>
            {course}
          </option>
        ))}
      </select>

      {/* PRESENT FILTER */}
      <button
        onClick={() => {
          setFilterPresent(!filterPresent);
          setFilterAbsent(false);
        }}
        className={`px-3 py-1 text-sm rounded ${filterPresent
          ? 'bg-green-500 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
      >
        Show Present Only ({presentCount})
      </button>

      {/* ABSENT FILTER */}
      <button
        onClick={() => {
          setFilterAbsent(!filterAbsent);
          setFilterPresent(false);
        }}
        className={`px-3 py-1 text-sm rounded ${filterAbsent
          ? 'bg-red-500 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
      >
        Show Absent Only ({absentCount})
      </button>

      {/* CLEAR FILTER */}
      {(filterPresent || filterAbsent || selectedBatch || selectedCourse) && (
        <button
          onClick={() => {
            setFilterPresent(false);
            setFilterAbsent(false);
            setSelectedBatch(null);
            setSelectedCourse(null);
          }}
          className="px-3 py-1 text-sm rounded bg-yellow-400 text-black hover:bg-yellow-500"
        >
          Clear Filter
        </button>
      )}

    </div>
  );
}