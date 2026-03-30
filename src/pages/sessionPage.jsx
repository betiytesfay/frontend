import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import contactImage from '../assets/contact.png'
import calanderImage from '../assets/calander.png'
import bgImage from '../assets/background.png'
import { BackButton } from '../component/backButton'
import axios from 'axios'

export default function SessionPage() {
  const navigate = useNavigate()
  const baseURL = "https://gibi-backend-669108940571.us-central1.run.app";
  const [totalStudent, setTotalStudent] = useState(null);
  const [lastSessionPresent, setLastSessionPresent] = useState(null);
  const [lastSessionDate, setLastSessionDate] = useState(null);
  const [showHistory, setShowHistory] = useState(false)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [loading, setLoading] = useState(true);

  // Fetch total students
  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        const response = await axios.get(`${baseURL}/student`);
        const students = response.data?.data || [];
        setTotalStudent(students.length);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setTotalStudent(0);
      }
    };
    fetchTotalStudents();
  }, []);

  // Fetch attendance data for last session
  useEffect(() => {
    const fetchLastSessionData = async () => {
      try {
        setLoading(true);

        // Fetch all required data
        const [courseDatesRes, attendanceRes, studentsRes] = await Promise.all([
          axios.get(`${baseURL}/course_date`),
          axios.get(`${baseURL}/attendance`),
          axios.get(`${baseURL}/student`)
        ]);

        const courseDates = courseDatesRes.data?.data?.courseDates || [];
        const students = studentsRes.data?.data?.students || [];
        const attendanceRecords = attendanceRes.data?.data?.attendance || [];

        // Get the latest course date
        const sortedCourseDates = [...courseDates].sort((a, b) => {
          return b.date_id - a.date_id;
        });

        const latestCourseDate = sortedCourseDates[0];

        if (!latestCourseDate) {
          setLastSessionDate('No sessions yet');
          setLastSessionPresent(0);
          setLoading(false);
          return;
        }

        // Set the last session date
        setLastSessionDate(latestCourseDate.class_date);

        // Filter attendance records for the latest session
        const lastSessionAttendance = attendanceRecords.filter(
          record => record.date_id === latestCourseDate.date_id
        );

        // Count present students in last session
        const presentCount = lastSessionAttendance.filter(
          record => record.is_present === true
        ).length;

        setLastSessionPresent(presentCount);

      } catch (err) {
        console.error("Failed to fetch last session data:", err);
        setLastSessionDate('N/A');
        setLastSessionPresent(0);
      } finally {
        setLoading(false);
      }
    };

    fetchLastSessionData();
  }, []);

  const handleCloseHistory = () => {
    setShowHistory(false)
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="w-full sm:w-[700px] min-h-[500px] p-6 sm:p-6 rounded-xl shadow-lg text-center flex flex-col justify-center gap-8 bg-white "
      >
        <div className="flex justify-start">
          <BackButton to="/login" label="← " />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
          Welcome, Session Admin!
        </h1>

        {/* Stats section */}
        <div className="mt-5 flex flex-row md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={contactImage}
              alt="Total Students"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl"
            />
            <div className="text-center sm:text-left">
              <p className="text-base sm:text-lg font-semibold">
                Total Students: <span className="text-blue-600">{totalStudent ?? 'Loading...'}</span>
              </p>
              <p className="text-gray-600">Currently enrolled</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate('/last-session-analysis')}
              className="w-32 h-32 sm:w-40 sm:h-40 cursor-pointer"
            >
              <img
                src={calanderImage}
                alt="Calendar"
                className="w-full h-full object-contain"
              />
            </button>

            <div className="text-center sm:text-left">
              <p className="text-base sm:text-lg font-semibold">
                Last Session: <span className="text-blue-600">{lastSessionDate ?? 'Loading...'}</span>
              </p>
              <p className="text-gray-600">
                {loading ? 'Loading...' :
                  lastSessionPresent !== null ?
                    `${lastSessionPresent} / ${totalStudent || 0} Present` :
                    'No attendance data'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center pt-3 pb-3 gap-4 sm:gap-4">
          <button
            onClick={() => navigate('/attendance')}
            className="flex-1 h-15 bg-[#D4AF35] text-white px-5 py-3 text-lg rounded-lg border-2 border-yellow-600 hover:bg-[#d6aa19] hover:text-white transition"
          >
            <b>Start Attendance</b>
          </button>

          <button
            onClick={() => navigate('/attendance-analysis')}
            className="flex-1 h-15 bg-[#D4AF35] text-white px-5 py-3 text-lg rounded-lg border-2 border-yellow-600 hover:bg-[#d6aa19] hover:text-white transition"
          >
            <b>View History</b>
          </button>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-[500px] text-center">
            <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-4">Attendance History</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2">Date</th>
                    <th className="border border-gray-300 px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((record, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-3 py-2">{record.date}</td>
                      <td
                        className={`border border-gray-300 px-3 py-2 font-semibold ${record.status === 'Present' ? 'text-green-600' : 'text-red-600'
                          }`}
                      >
                        {record.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleCloseHistory}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}