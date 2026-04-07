// src/component/SessionFilter.jsx
export default function SessionFilter({
  sessions,
  selectedBatch,
  setSelectedBatch,
  selectedCourse,
  setSelectedCourse
}) {
  const batches = Array.from(new Set(sessions.map(s => s.batchName))).filter(Boolean);
  const courses = Array.from(new Set(sessions.map(s => s.courseName))).filter(Boolean);

  return (
    <div className="flex gap-4 flex-wrap mb-6">
      <select
        value={selectedBatch || ""}
        onChange={(e) => setSelectedBatch(e.target.value || null)}
        className="border border-gray-300 rounded px-3 py-1"
      >
        <option value="">All Batches</option>
        {batches.map(batch => (
          <option key={batch} value={batch}>{batch}</option>
        ))}
      </select>

      <select
        value={selectedCourse || ""}
        onChange={(e) => setSelectedCourse(e.target.value || null)}
        className="border border-gray-300 rounded px-3 py-1"
      >
        <option value="">All Courses</option>
        {courses.map(course => (
          <option key={course} value={course}>{course}</option>
        ))}
      </select>
    </div>
  );
}