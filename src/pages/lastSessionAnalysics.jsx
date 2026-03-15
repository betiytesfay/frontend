// LastSessionAnalyticsPage.jsx
import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BackButton } from "../component/backButton";

export default function LastSessionAnalyticsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = location.state || {}; // frontend session passed via navigate

  const [filters, setFilters] = useState({ gender: "", department: "" });

  if (!session) {
    navigate("/attendance"); // fallback if no session
    return null;
  }

  // Compute filtered students
  const filteredStudents = useMemo(() => {
    return session.students.filter(s => {
      const student = s.student || {}; // session may store student info
      if (filters.gender && student.gender !== filters.gender) return false;
      if (filters.department && student.department !== filters.department) return false;
      return true;
    });
  }, [session.students, filters]);

  // Pie chart data
  const presentCount = filteredStudents.filter(s => s.is_present).length;
  const absentCount = filteredStudents.length - presentCount;
  const pieData = [
    { name: "Present", value: presentCount },
    { name: "Absent", value: absentCount },
  ];
  const COLORS = ["#D4AF35", "#CCCCCC"];

  // Extract batch and department options from session
  const batches = Array.from(new Set(session.students.map(s => s.student?.current_batch_id || "N/A")));
  const departments = Array.from(new Set(session.students.map(s => s.student?.department || "N/A")));

  return (
    <div className="p-6">
      <BackButton onClick={() => navigate(-1)} label="← " />

      <h1 className="text-3xl font-bold text-[#D4AF35] mb-4">Session Analytics</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={filters.gender}
          onChange={e => setFilters(f => ({ ...f, gender: e.target.value }))}
          className="border p-2 rounded"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
          value={filters.department}
          onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
          className="border p-2 rounded"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={filters.batch}
          onChange={e => setFilters(f => ({ ...f, batch: e.target.value }))}
          className="border p-2 rounded"
        >
          <option value="">All Batches</option>
          {batches.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Student List */}
      <h2 className="text-xl font-bold mb-2">Students</h2>
      <div className="bg-white p-4 rounded shadow max-h-80 overflow-y-auto">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-1">Student ID</th>
              <th className="border border-gray-300 px-2 py-1">Name</th>
              <th className="border border-gray-300 px-2 py-1">Batch</th>
              <th className="border border-gray-300 px-2 py-1">Department</th>
              <th className="border border-gray-300 px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(s => (
              <tr key={s.student_id}>
                <td className="border border-gray-300 px-2 py-1">{s.student_id}</td>
                <td className="border border-gray-300 px-2 py-1">{s.student?.first_name} {s.student?.last_name}</td>
                <td className="border border-gray-300 px-2 py-1">{s.student?.current_batch_id}</td>
                <td className="border border-gray-300 px-2 py-1">{s.student?.department}</td>
                <td className="border border-gray-300 px-2 py-1">{s.is_present ? "Present" : "Absent"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
