import { useState } from 'react';
import ReusablePieChart from './PieChartComponent';
import AttendanceFilter from './AttendanceFilter';

const COLORS = [
  '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f97316', '#06b6d4', '#a3e635',
  '#e11d48', '#7c3aed', '#0891b2', '#65a30d'
];

export default function SessionCard({ session, allBatches, isExpanded, onToggle }) {
  const [filterPresent, setFilterPresent] = useState(false);
  const [filterAbsent, setFilterAbsent] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const { stats } = session;

  // Pie chart slices — split by department
  const getDeptSlices = (students) => {
    const departments = Array.from(new Set(students.map(s => s.department))).filter(Boolean).sort();
    return departments.flatMap(dept => {
      const inDept = students.filter(s => s.department === dept);
      const present = inDept.filter(s => s.is_present).length;
      const absent = inDept.length - present;
      return [
        { name: `${dept} Present`, value: present },
        { name: `${dept} Absent`, value: absent },
      ];
    });
  };

  // Filtered students for the expanded list
  const getFilteredStudents = (students) => {
    let filtered = students;
    if (selectedDepartment) filtered = filtered.filter(s => s.department === selectedDepartment);
    if (filterPresent && filterAbsent) return filtered;
    if (filterPresent) return filtered.filter(s => s.is_present);
    if (filterAbsent) return filtered.filter(s => !s.is_present);
    return filtered;
  };

  // Students for pie chart — only dept filter, ignore present/absent toggle
  const deptStudents = selectedDepartment
    ? session.students.filter(s => s.department === selectedDepartment)
    : session.students;

  const pieSlices = selectedDepartment
    ? undefined  // use present/absent mode with deptStudents
    : getDeptSlices(session.students);

  const piePresent = deptStudents.filter(s => s.is_present).length;
  const pieAbsent = deptStudents.length - piePresent;
  const pieTotal = deptStudents.length;
  const piePresentPct = pieTotal > 0 ? ((piePresent / pieTotal) * 100).toFixed(1) : 0;
  const pieAbsentPct = pieTotal > 0 ? ((pieAbsent / pieTotal) * 100).toFixed(1) : 0;

  // Students for expanded list — dept + present/absent filters
  const filteredStudents = getFilteredStudents(session.students);
  const filteredPresent = filteredStudents.filter(s => s.is_present).length;
  const filteredAbsent = filteredStudents.filter(s => !s.is_present).length;
  const filteredTotal = filteredStudents.length;
  const filteredPresentPercent = filteredTotal > 0 ? ((filteredPresent / filteredTotal) * 100).toFixed(1) : 0;
  const filteredAbsentPercent = filteredTotal > 0 ? ((filteredAbsent / filteredTotal) * 100).toFixed(1) : 0;

  return (
    <div className="mb-6 bg-gray-100 border border-yellow-400 rounded-lg p-4">
      <h2 className="font-bold text-lg mb-2 text-gray-800">{session.date} - {session.courseName}</h2>

      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-white p-2 rounded shadow">
          <div className="text-xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-500">Total Students</div>
        </div>
        <div className="bg-green-100 p-2 rounded shadow">
          <div className="text-xl font-bold text-green-600">{stats.present}</div>
          <div className="text-xs text-green-600">{stats.presentPercentage}%</div>
        </div>
        <div className="bg-red-100 p-2 rounded shadow">
          <div className="text-xl font-bold text-red-600">{stats.absent}</div>
          <div className="text-xs text-red-600">{stats.absentPercentage}%</div>
        </div>
      </div>

      {/* Pie chart — department split when no dept filter, otherwise present/absent */}
      <ReusablePieChart
        present={piePresent}
        absent={pieAbsent}
        presentPercentage={piePresentPct}
        absentPercentage={pieAbsentPct}
        slices={pieSlices}
        onClick={onToggle}
      />

      {session.students.length > 0 && (
        <AttendanceFilter
          presentCount={stats.present}
          absentCount={stats.absent}
          filterPresent={filterPresent}
          filterAbsent={filterAbsent}
          setFilterPresent={setFilterPresent}
          setFilterAbsent={setFilterAbsent}
          allBatches={allBatches}
          sessions={[session]}
          selectedBatch={null}
          setSelectedBatch={() => {}}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />
      )}

      {isExpanded && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-yellow-600">
            Student Attendance
            {filteredStudents.length !== session.students.length &&
              ` (Filtered: ${filteredStudents.length} of ${session.students.length})`}
          </h3>
          {filteredStudents.length > 0 ? (
            <div className="max-h-60 overflow-y-auto bg-white rounded shadow-inner p-2">
              {filteredStudents.map(s => (
                <div key={s.student_id} className="border-b border-gray-200 py-2 text-sm flex justify-between">
                  <span className="text-gray-700">{s.name} ({s.student_id})</span>
                  <span className={s.is_present ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {s.is_present ? 'Present' : 'Absent'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-2 bg-gray-50 rounded">No students to display</p>
          )}
        </div>
      )}
    </div>
  );
}
