import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReusablePieChart from '../component/PieChartComponent';
import SessionFilter from '../component/SessionFilter';
import AttendanceFilter from '../component/AttendanceFilter';
const BASE_URL = "https://gibi-backend-669108940571.us-central1.run.app";

export default function AttendanceAnalysisPage() {
  const navigate = useNavigate();
  const [backendSessions, setBackendSessions] = useState([]);
  const [allCourseDates, setAllCourseDates] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterPresent, setFilterPresent] = useState(false);
  const [filterAbsent, setFilterAbsent] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // Admin password verification
  const verifySessionAdminPassword = async (enteredPassword) => {
    const adminId = localStorage.getItem('adminId');
    if (!adminId) {
      alert('No admin logged in!');
      return false;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/auth/login`,
        { student_id: adminId, password: enteredPassword },
        { withCredentials: true }
      );
      const user = res.data?.data?.user;
      return user?.role === 'admin';
    } catch (err) {
      console.error('Password verification failed', err.response?.data || err);
      return false;
    }
  };


  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [courseDatesRes, attendanceRes, studentsRes] = await Promise.all([
          axios.get(`${BASE_URL}/course_date`),
          axios.get(`${BASE_URL}/attendance`),
          axios.get(`${BASE_URL}/student`)
        ]);

        const courseDates = courseDatesRes.data?.data?.courseDates || [];
        setAllCourseDates(courseDates);
        const sessionsFormatted = courseDates.map(cd => {

          const match = cd.class_date.match(/(\d{4})\sE\.C\./);
          const sessionYear = match ? parseInt(match[1], 10) : null;

          return {
            id: cd.date_id,
            date: cd.class_date,
            sessionYear,
            courseName: cd.course?.course_name || 'N/A',

          };
        });
        const students = studentsRes.data?.data || [];
        setAllStudents(students);

        const attendanceRecords = attendanceRes.data?.data?.attendanceRecords || [];

        // Build attendance map per date_id
        const attendanceByDate = {};
        attendanceRecords.forEach(record => {
          const dateId = record.date_id;
          if (!attendanceByDate[dateId]) attendanceByDate[dateId] = [];
          attendanceByDate[dateId].push({
            student_id: record.student_id,
            is_present: record.is_present
          });
        });

        // Create full session objects with statistics (like LastSessionAnalysisPage)
        const sessionsWithStats = courseDates.map(cd => {
          const match = cd.class_date.match(/(\d{4})\sE\.C\./);
          const sessionYear = match ? parseInt(match[1], 10) : null;

          // Get attendance records for this specific date
          const dateAttendance = attendanceByDate[cd.date_id] || [];

          // Create a map for quick lookup
          const attendanceMap = {};
          dateAttendance.forEach(record => {
            attendanceMap[record.student_id] = record.is_present;
          });

          // Build student list with presence flag
          const studentsWithAttendance = students.map(student => ({
            student_id: student.student_id,
            name: `${student.first_name} ${student.last_name}`,
            is_present: attendanceMap[student.student_id] === true,
            gender: student.gender || 'N/A',
            department: student.department || 'N/A'
          }));

          const present = studentsWithAttendance.filter(s => s.is_present).length;
          const absent = studentsWithAttendance.filter(s => !s.is_present).length;
          const total = studentsWithAttendance.length;

          return {
            id: cd.date_id,
            date: cd.class_date,
            sessionYear,
            courseName: cd.course?.course_name || 'N/A',
            batchId: cd.batch_id,
            students: studentsWithAttendance,
            stats: {
              total,
              present,
              absent,
              presentPercentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
              absentPercentage: total > 0 ? ((absent / total) * 100).toFixed(1) : 0
            }
          };
        });

        setBackendSessions(sessionsWithStats);   // ✅ Now contains everything needed


      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const filteredSessions = backendSessions.filter(session => {
    const batchMatches = !selectedBatch || session.batchName === selectedBatch;
    const courseMatches = !selectedCourse || session.courseName === selectedCourse;
    return batchMatches && courseMatches;
  });

  const handleBack = async () => {
    const enteredPassword = prompt('Enter session admin password to go back:');
    if (!enteredPassword) return;
    const isValid = await verifySessionAdminPassword(enteredPassword);
    if (isValid) navigate(-1);
    else alert('Incorrect password!');
  };

  const getFilteredStudents = (students) => {
    if (filterPresent && filterAbsent) return students;
    if (filterPresent) return students.filter(s => s.is_present);
    if (filterAbsent) return students.filter(s => !s.is_present);
    return students;
  };

  if (loading) return <p className="text-gray-900 p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 md:p-8">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Attendance Analysis</h1>
      <SessionFilter
        sessions={backendSessions}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
      />
      {backendSessions.length === 0 ? (
        <p className="text-gray-500">No attendance data available.</p>
      ) : (
        backendSessions.filter(session => {
          const yearMatches = !selectedYear || session.sessionYear === parseInt(selectedYear, 10);
          const courseMatches = !selectedCourse || session.courseName === selectedCourse;
          return yearMatches && courseMatches;
        }).map(session => {
          const { stats } = session;
          const pieData = [
            { name: `Present (${stats.presentPercentage}%)`, value: stats.present },
            { name: `Absent (${stats.absentPercentage}%)`, value: stats.absent }
          ];

          const hasData = stats.present > 0 || stats.absent > 0;
          const filteredStudents = getFilteredStudents(session.students);

          return (
            <div key={session.id} className="mb-6 bg-gray-100 border border-yellow-400 rounded-lg p-4">
              <h2 className="font-bold text-lg mb-2 text-gray-800">{session.date} - {session.courseName}</h2>

              {/* Stats summary */}
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

              {/* PieChart */}
              <ReusablePieChart
                present={stats.present}
                absent={stats.absent}
                presentPercentage={stats.presentPercentage}
                absentPercentage={stats.absentPercentage}
                onClick={() =>
                  setSelectedSessionId(
                    selectedSessionId === session.id ? null : session.id
                  )
                }
              />

              {session.students.length > 0 && (
                <AttendanceFilter
                  presentCount={stats.present}
                  absentCount={stats.absent}
                  filterPresent={filterPresent}
                  filterAbsent={filterAbsent}
                  setFilterPresent={setFilterPresent}
                  setFilterAbsent={setFilterAbsent}
                  sessions={backendSessions}
                  selectedBatch={selectedBatch}
                  setSelectedBatch={setSelectedBatch}
                  selectedCourse={selectedCourse}
                  setSelectedCourse={setSelectedCourse}
                />
              )}

              {selectedSessionId === session.id && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2 text-yellow-600">
                    Student Attendance {filteredStudents.length !== session.students.length &&
                      `(Filtered: ${filteredStudents.length} of ${session.students.length})`}
                  </h3>
                  {filteredStudents.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto bg-white rounded shadow-inner p-2">
                      {filteredStudents.map(s => (
                        <div key={s.student_id} className="border-b border-gray-200 py-2 text-sm flex justify-between">
                          <span className="text-gray-700">
                            {s.name} ({s.student_id})
                          </span>
                          <span className={s.is_present ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                            {s.is_present ? 'Present' : 'Absent'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-2 bg-gray-50 rounded">
                      No students to display
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}