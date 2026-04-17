import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import LoadingScreen from '../component/LoadingScreen';

const COLORS = ['#22c55e', '#ef4444'];
const BASE_URL = "https://gibi-backend-669108940571.us-central1.run.app";

export default function LastSessionAnalysisPage() {
  const navigate = useNavigate();
  const [lastSession, setLastSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterPresent, setFilterPresent] = useState(false);
  const [filterAbsent, setFilterAbsent] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false);

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

  // Fetch all data and get last session
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
        const students = studentsRes.data?.data || [];
        const attendanceRecords = attendanceRes.data?.data?.attendanceRecords || [];

        // Sort course dates to get the most recent one
        const sortedCourseDates = [...courseDates].sort((a, b) => {
          return b.date_id - a.date_id;
        });

        const latestCourseDate = sortedCourseDates[0];
        if (!latestCourseDate) {
          setLoading(false);
          return;
        }

        // Process attendance for the last session only
        const attendanceByDate = {};
        attendanceRecords.forEach(record => {
          const dateId = record.date_id;
          if (!attendanceByDate[dateId]) attendanceByDate[dateId] = [];
          attendanceByDate[dateId].push({
            student_id: record.student_id,
            is_present: record.is_present
          });
        });

        const totalStudents = students.length;
        const dateAttendance = attendanceByDate[latestCourseDate.date_id] || [];

        // Create attendance map
        const attendanceMap = {};
        dateAttendance.forEach(r => {
          attendanceMap[r.student_id] = r.is_present;
        });

        const studentsWithAttendance = students.map(student => {
          const isPresent = attendanceMap[student.student_id];

          return {
            student_id: student.student_id,
            name: `${student.first_name} ${student.last_name}`,
            is_present: isPresent === true, // true if present, false if absent or not marked
            gender: student.gender || 'N/A',
            department: student.department || 'N/A'
          };
        });

        const present = studentsWithAttendance.filter(s => s.is_present).length;
        const absent = studentsWithAttendance.filter(s => !s.is_present).length;

        const sessionData = {
          id: latestCourseDate.date_id,
          date: latestCourseDate.class_date,
          batchId: latestCourseDate.batch_id,
          courseDateId: latestCourseDate.date_id,
          courseName: latestCourseDate.course?.course_name || 'N/A',
          students: studentsWithAttendance,
          stats: {
            total: totalStudents,
            present,
            absent,
            presentPercentage: totalStudents > 0 ? ((present / totalStudents) * 100).toFixed(1) : 0,
            absentPercentage: totalStudents > 0 ? ((absent / totalStudents) * 100).toFixed(1) : 0
          }
        };

        setLastSession(sessionData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const toggleStudentList = () => {
    setShowStudentList(!showStudentList);
  };

  if (loading) return <LoadingScreen message="Loading last session..." />;
  if (!lastSession) return <p className="text-gray-900 p-6">No session data available.</p>;

  const { stats } = lastSession;
  const pieData = [
    { name: `Present (${stats.presentPercentage}%)`, value: stats.present },
    { name: `Absent (${stats.absentPercentage}%)`, value: stats.absent }
  ];

  const hasData = stats.total > 0;
  const filteredStudents = getFilteredStudents(lastSession.students);

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 md:p-8">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Last Session Analysis</h1>

      <div className="bg-gray-100 border border-yellow-400 rounded-lg p-4">
        <h2 className="font-bold text-lg mb-2">
          {lastSession.date} - {lastSession.courseName}
        </h2>

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
        {hasData ? (
          <div
            className="w-full flex justify-center mb-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={toggleStudentList}
          >
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx={150}
                cy={150}
                outerRadius={100}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', color: '#333', border: '1px solid #ddd' }}
                formatter={(value, name) => [`${value} students`, name]}
              />
              <Legend wrapperStyle={{ color: '#333' }} />
            </PieChart>
          </div>
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">No attendance records for this session</p>
          </div>
        )}

        {/* Filters - always visible */}
        {lastSession.students.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
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
              Show Present Only ({stats.present})
            </button>
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
              Show Absent Only ({stats.absent})
            </button>
            {(filterPresent || filterAbsent) && (
              <button
                onClick={() => {
                  setFilterPresent(false);
                  setFilterAbsent(false);
                }}
                className="px-3 py-1 text-sm rounded bg-yellow-400 text-black hover:bg-yellow-500"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}

        {/* Student list - shown only when pie chart is clicked */}
        {showStudentList && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-yellow-400">
              Student Attendance {filteredStudents.length !== lastSession.students.length &&
                `(Filtered: ${filteredStudents.length} of ${lastSession.students.length})`}
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
    </div>
  );
}