import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../component/backButton';

export default function sessionHistory() {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterYearEnabled, setFilterYearEnabled] = useState(true);
  const [filterGenderEnabled, setFilterGenderEnabled] = useState(false);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterGender, setFilterGender] = useState('All');

  // Add Session form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionDate, setNewSessionDate] = useState('');
  const [newSessionRate, setNewSessionRate] = useState('');
  const [newSessionYear, setNewSessionYear] = useState(new Date().getFullYear());
  const [showEditForm, setShowEditForm] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editRate, setEditRate] = useState('');
  const [editYear, setEditYear] = useState(new Date().getFullYear());

  // Sessions & filtered sessions
  const [sessions, setSessions] = useState([
    { id: 1, name: 'Fourth Year students', date: '2024-03-15', rate: '88%', year: 2025 },
    { id: 2, name: 'Third Year students', date: '2024-03-22', rate: '92%', year: 2025 },
    { id: 3, name: 'Second Year students', date: '2024-03-29', rate: '78%', year: 2025 },
    { id: 4, name: 'First Year students', date: '2024-04-05', rate: '90%', year: 2025 },
  ]);
  const [filteredSessions, setFilteredSessions] = useState(sessions);

  // Attendance Data
  const attendanceData = {
    1: [{ name: 'Student 1', status: 'Present', gender: 'female' }, { name: 'Student 2', status: 'Absent', gender: 'female' }],
    2: [{ name: 'Student 1', status: 'Present', gender: 'male' }, { name: 'Student 2', status: 'Present', gender: 'female' }, { name: 'Student 3', status: 'Present', gender: 'male' }],
    3: [{ name: 'Student 1', status: 'Absent', gender: 'female' }, { name: 'Student 2', status: 'Present', gender: 'female' }],
    4: [{ name: 'Student 1', status: 'Present', gender: 'female' }, { name: 'Student 2', status: 'Present', gender: 'female' }],
  };

  const getAttendanceSummary = (sessionId) => {
    const data = attendanceData[sessionId] || [];
    const summary = { Present: 0, Absent: 0 };
    data.forEach((student) => {
      if (summary[student.status] !== undefined) summary[student.status]++;
    });
    return summary;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-600';
      case 'Absent': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  // Apply filters whenever filter/search changes
  useEffect(() => {
    let filtered = sessions;

    if (filterYearEnabled) {
      filtered = filtered.filter(s => s.year === filterYear);
    }

    if (filterGenderEnabled && filterGender !== 'All') {
      filtered = filtered.filter(session =>
        (attendanceData[session.id] || []).some(student => student.gender === filterGender)
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    setFilteredSessions(filtered);
  }, [sessions, searchQuery, filterYearEnabled, filterGenderEnabled, filterYear, filterGender]);

  return (
    <div className="min-h-screen justify-center bg-[#d1c8c8] text-black flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-6xl justify-center bg-[#ffffff] p-4 sm:p-8 rounded-xl shadow-lg border border-[#e0d9d9]">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold text-[#D4AF35]">Session Attendance History</h1>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/attendance-analysis')}
              className="bg-[#D4AF35] text-white px-4 py-2 rounded hover:bg-[#ffc70f] transition w-full sm:w-auto"
            >
              Attendance Analysis
            </button>

            {/* Add Session Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-[#D4AF35] text-white px-4 py-2 rounded hover:bg-[#ffc70f] transition w-full sm:w-auto"
              >
                + Add Session
              </button>

              {showAddForm && (
                <div className="absolute right-0 mt-2 bg-[#222] p-4 rounded shadow-lg border border-gray-600 w-64 sm:w-72 z-10">
                  <h3 className="text-[#D4AF35] mb-3 font-semibold text-center">Add New Session</h3>

                  <input
                    type="text"
                    placeholder="Session name..."
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    className="w-full mb-2 p-2 rounded bg-white text-black border border-gray-500"
                  />

                  <input
                    type="date"
                    value={newSessionDate}
                    onChange={(e) => setNewSessionDate(e.target.value)}
                    className="w-full mb-2 p-2 rounded bg-black text-white border border-gray-500"
                  />

                  <input
                    type="text"
                    placeholder="Rate (e.g. 85%)"
                    value={newSessionRate}
                    onChange={(e) => setNewSessionRate(e.target.value)}
                    className="w-full mb-2 p-2 rounded bg-white text-white border border-gray-500"
                  />

                  <input
                    type="number"
                    placeholder="Year"
                    value={newSessionYear}
                    onChange={(e) => setNewSessionYear(parseInt(e.target.value))}
                    className="w-full mb-3 p-2 rounded bg-black text-white border border-gray-500"
                  />

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        if (!newSessionName || !newSessionDate || !newSessionRate || !newSessionYear) {
                          alert('Please fill all fields');
                          return;
                        }
                        const newSession = {
                          id: sessions.length + 1,
                          name: newSessionName,
                          date: newSessionDate,
                          rate: newSessionRate,
                          year: newSessionYear,
                        };
                        setSessions([...sessions, newSession]);
                        setFilteredSessions([...sessions, newSession]);
                        setShowAddForm(false);
                        setNewSessionName('');
                        setNewSessionDate('');
                        setNewSessionRate('');
                        setNewSessionYear(new Date().getFullYear());
                      }}
                      className="flex-1 bg-[#D4AF35] text-black py-1 rounded hover:bg-[#d6aa19] transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 bg-gray-600 text-white py-1 rounded hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search session name..."
            className="p-2 rounded flex-1 bg-white text-gray-300 border border-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="bg-[#D4AF35] text-black px-4 py-2 rounded hover:bg-[#d6aa19] transition"
          >
            Filter {showFilterPanel ? '▲' : '▼'}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="bg-[#dbd6d6] p-4 rounded mb-6 w-full sm:max-w-lg shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={filterYearEnabled} onChange={() => setFilterYearEnabled(!filterYearEnabled)} />
              <label>Filter by Year</label>
              {filterYearEnabled && (
                <select className="ml-auto p-2 rounded text-black" value={filterYear} onChange={(e) => setFilterYear(parseInt(e.target.value))}>
                  {[...new Set(sessions.map(s => s.year))].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={filterGenderEnabled} onChange={() => setFilterGenderEnabled(!filterGenderEnabled)} />
              <label>Filter by Gender</label>
              {filterGenderEnabled && (
                <select className="ml-auto p-2 rounded text-black" value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
                  <option value="All">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              )}
            </div>

            <button
              onClick={() => {
                let filtered = sessions;

                if (filterYearEnabled) filtered = filtered.filter(s => s.year === filterYear);
                if (filterGenderEnabled && filterGender !== 'All') {
                  filtered = filtered.filter(session =>
                    (attendanceData[session.id] || []).some(student => student.gender === filterGender)
                  );
                }
                if (searchQuery) filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

                setFilteredSessions(filtered);
                setShowFilterPanel(false);
              }}
              className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-400 transition mt-2"
            >
              Apply
            </button>
          </div>
        )}

        {/* Sessions Table */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-[#ffffff] rounded-lg p-4 sm:p-6 border border-[#D4AF35] overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="border-b border-black">
                <tr className="border-b border-black text-[#D4AF35] text-sm sm:text-base">
                  <th className="py-2">Session Name</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Rate</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="border-b border-[#D4AF35] hover:bg-gray-800 transition text-sm sm:text-base">
                    <td className="py-2 text-[#D4AF35]">{session.name}</td>
                    <td className="py-2 text-[#D4AF35]">{session.date}</td>
                    <td className="py-2 text-[#D4AF35]">{session.rate}</td>
                    <td className="py-2">
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="bg-[#D4AF35] text-black px-3 py-1 rounded hover:bg-[#d6aa19] transition text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Attendance Details */}
          {selectedSession && (
            <div className="flex-1 bg-[#1a1a1a] rounded-lg p-4 sm:p-6 border border-black animate-fadeIn">
              <h2 className="text-base sm:text-lg font-semibold mb-4 text-[#D4AF35]">
                Attendance for {selectedSession.name} ({selectedSession.year})
              </h2>
              <div className="flex flex-wrap gap-3 mb-4">
                {Object.entries(getAttendanceSummary(selectedSession.id)).map(([status, count]) => (
                  <div key={status} className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(status)}`}>
                    {status}: {count}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {attendanceData[selectedSession.id]
                  ?.filter(student => filterGender === 'All' || student.gender.toLowerCase() === filterGender.toLowerCase())
                  .map((student, i) => (
                    <div key={i} className="flex justify-between items-center bg-[#222] p-3 rounded hover:bg-[#333] transition">
                      <span className="text-sm sm:text-base">{student.name}</span>
                      <span className={`${getStatusColor(student.status)} px-3 py-1 rounded text-sm font-semibold`}>
                        {student.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={() => navigate('/sessionAdmin')}
            className="bg-[#D4AF35] text-black px-6 py-2 rounded-lg shadow-md hover:bg-[#d6aa19] hover:scale-105 transition-transform duration-200 font-semibold text-sm sm:text-base"
          >
            ← Back To Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
