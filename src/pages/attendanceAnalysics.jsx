import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const sessions = [
  { id: 1, name: 'Session One', yearLabel: 'First Year', year: 2025, department: 'Accounting' },
  { id: 2, name: 'Session Two', yearLabel: 'Second Year', year: 2025, department: 'Sociology' },
  { id: 3, name: 'Session Three', yearLabel: 'First Year', year: 2025, department: 'Economics' },
  { id: 4, name: 'Session Four', yearLabel: 'First Year', year: 2025, department: 'Logistics' },
]

const attendanceData = {
  1: [
    { id: 101, name: 'Abebe', studentId: '1234', status: 'Present', gender: 'Male', department: 'Accounting', phone: '0912345678' },
    { id: 102, name: 'Sara', studentId: '2345', status: 'Absent', gender: 'Female', department: 'Accounting', phone: '0912345679' },
    { id: 103, name: 'Mikael', studentId: '3456', status: 'Present', gender: 'Male', department: 'Accounting', phone: '0912345680' },
  ],
  2: [
    { id: 201, name: 'John', studentId: '4567', status: 'Present', gender: 'Male', department: 'Sociology', phone: '0912345681' },
  ],
  3: [
    { id: 301, name: 'Alice', studentId: '5678', status: 'Absent', gender: 'Female', department: 'Economics', phone: '0912345682' },
  ],
  4: [
    { id: 401, name: 'Eleni', studentId: '6789', status: 'Present', gender: 'Female', department: 'Logistics', phone: '0912345683' },
  ],
}

export default function AttendanceAnalysis() {
  const navigate = useNavigate()

  const [searchId, setSearchId] = useState('')
  const [filterGender, setFilterGender] = useState('All')
  const [filterDepartment, setFilterDepartment] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const studentsPerPage = 5

  const allStudents = Object.values(attendanceData).flat()

  // Default filter: first-year students
  const firstYearStudents = allStudents
    .filter(s =>
      sessions.find(sess =>
        sess.id ===
        Number(Object.keys(attendanceData).find(id => attendanceData[id].includes(s)))
      )?.yearLabel === 'First Year'
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  // Filtering logic
  let filteredStudents = searchId
    ? allStudents.filter(s => s.studentId === searchId)
    : firstYearStudents.filter(s =>
      (filterGender === 'All' || s.gender === filterGender) &&
      (filterDepartment === 'All' || s.department === filterDepartment)
    )

  const indexOfLast = currentPage * studentsPerPage
  const indexOfFirst = indexOfLast - studentsPerPage
  const currentStudents = searchId
    ? filteredStudents
    : filteredStudents.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)

  const calculateAttendance = (student) => {
    const records = Object.values(attendanceData).flat().filter(st => st.studentId === student.studentId)
    const totalSessions = records.length
    const presentCount = records.filter(r => r.status === 'Present').length
    const percentPresent = totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0
    return percentPresent.toFixed(1)
  }

  return (
    <div className="min-h-screen  bg-[#111] text-white flex flex-col items-center p-4 md:p-8">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Attendance Analysis</h1>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-2 mb-6 w-full max-w-4xl">
        <input
          type="text"
          placeholder="Enter student ID"
          value={searchId}
          onChange={(e) => { setSearchId(e.target.value); setCurrentPage(1) }}
          className="p-2 border border-yellow-400 bg-transparent rounded flex-1 text-white placeholder-gray-400"
        />
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          className="p-2 border border-yellow-400 bg-transparent rounded text-white"
        >
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="p-2 border border-yellow-400 bg-transparent rounded text-white"
        >
          <option value="All">All Departments</option>
          {[...new Set(allStudents.map(s => s.department))].map(dep =>
            <option key={dep} value={dep}>{dep}</option>
          )}
        </select>
      </div>

      {/* Students List */}
      <div className="w-full max-w-4xl space-y-4">
        {currentStudents.length === 0 && (
          <p className="text-gray-400 text-center">No student found.</p>
        )}

        {currentStudents.map((s) => {
          const percentPresent = calculateAttendance(s)
          return (
            <div
              key={s.studentId}
              className="bg-white/10 border border-yellow-400 rounded-lg p-4 flex flex-col gap-3"
            >
              <div className="flex flex-col md:flex-row md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-yellow-400">{s.name}</p>
                  <p className="text-sm text-gray-300">ID: {s.studentId}</p>
                </div>
                <div className="text-sm text-gray-300 mt-2 md:mt-0">
                  <p>Department: {s.department}</p>
                  <p>Gender: {s.gender}</p>
                  <p>Phone: {s.phone}</p>
                </div>
              </div>

              <div className="mt-2">
                <div className="w-full bg-white/20 h-3 rounded">
                  <div
                    className="h-3 rounded bg-green-500 transition-all duration-500"
                    style={{ width: `${percentPresent}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-300 mt-1">{percentPresent}% Present</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {!searchId && totalPages > 1 && (
        <div className="flex gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border border-yellow-400 ${currentPage === i + 1 ? 'bg-yellow-400 text-black' : 'text-yellow-400'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/sessionhistory')}
        className="mt-8 border border-yellow-400 text-yellow-400 px-6 py-2 rounded-md hover:bg-yellow-400 hover:text-black transition"
      >
        ← Back To Session History
      </button>
    </div>
  )
} 