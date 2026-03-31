export default function SessionFilter({
  sessions,
  selectedYear,
  setSelectedYear,
  selectedCourse,
  setSelectedCourse
}) {
  // Get unique years from sessions
  const years = Array.from(
    new Set(sessions.map(s => new Date(s.date).getFullYear()))
  ).sort((a, b) => b - a); // descending

  // Get unique courses
  const courses = Array.from(
    new Set(sessions.map(s => s.courseName))
  );

  return (
    <div className="flex gap-4 flex-wrap mb-6">

      {/* Year Filter */}
      <select
        value={selectedYear || ''}
        onChange={(e) => setSelectedYear(e.target.value || null)}
        className="border border-gray-300 rounded px-3 py-1"
      >
        <option value="">All Years</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      {/* Course Filter */}
      <select
        value={selectedCourse || ''}
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