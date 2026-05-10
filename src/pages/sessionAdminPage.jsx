import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import contactImage from '../assets/contact.png'
import calanderImage from '../assets/calander.png'
import bgImage from '../assets/background.png'
import { BackButton } from '../component/backButton'
import axios from 'axios'

const baseURL = "https://gibi-backend-669108940571.us-central1.run.app";

export default function SessionPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [totalStudent, setTotalStudent] = useState(null);
  const [lastSessionDate, setLastSessionDate] = useState(null);
  const [lastSessionPresent, setLastSessionPresent] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [courseDatesRes, attendanceRes, studentsRes] = await Promise.all([
          axios.get(`${baseURL}/course_date`),
          axios.get(`${baseURL}/attendance`),
          axios.get(`${baseURL}/student`)
        ]);

        const students = studentsRes.data?.data || [];
        const courseDates = courseDatesRes.data?.data?.courseDates || [];
        const attendanceRecords = attendanceRes.data?.data?.attendanceRecords || [];

        setTotalStudent(students.length);

        if (!courseDates.length) {
          setLastSessionDate('No sessions yet');
          setLastSessionPresent(0);
          return;
        }

        const latest = [...courseDates].sort((a, b) => b.date_id - a.date_id)[0];

        const presentCount = attendanceRecords.filter(
          r => r.date_id === latest.date_id && r.is_present === true
        ).length;

        setLastSessionDate(latest.class_date);
        setLastSessionPresent(presentCount);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full sm:w-[700px] min-h-[500px] p-6 sm:p-6 rounded-xl shadow-lg text-center flex flex-col justify-center gap-8 bg-white">
        <div className="flex justify-start">
          <BackButton to="/" label="← " />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
          Welcome, Session Admin!
        </h1>

        <div className="mt-5 flex flex-row md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img src={contactImage} alt="Total Students" className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl" />
            <div className="text-center sm:text-left">
              <p className="text-base sm:text-lg font-semibold">
                Total Students: <span className="text-blue-600">{loading ? 'Loading...' : totalStudent}</span>
              </p>
              <p className="text-gray-600">Currently enrolled</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button onClick={() => navigate('/last-session-analysis')} className="w-32 h-32 sm:w-40 sm:h-40 cursor-pointer">
              <img src={calanderImage} alt="Calendar" className="w-full h-full object-contain" />
            </button>
            <div className="text-center sm:text-left">
              <p className="text-base sm:text-lg font-semibold">
                Last Session: <span className="text-blue-600">{loading ? 'Loading...' : lastSessionDate}</span>
              </p>
              <p className="text-gray-600">
                {loading ? 'Loading...' : `${lastSessionPresent} / ${totalStudent || 0} Present`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center pt-3 pb-3 gap-4 sm:gap-4">
          <button
            onClick={() => navigate('/attendance')}
            className="flex-1 h-15 bg-[#D4AF35] text-white px-5 py-3 text-lg rounded-lg border-2 border-yellow-600 hover:bg-[#d6aa19] transition"
          >
            <b>Start Attendance</b>
          </button>
          <button
            onClick={() => navigate('/attendance-analysis')}
            className="flex-1 h-15 bg-[#D4AF35] text-white px-5 py-3 text-lg rounded-lg border-2 border-yellow-600 hover:bg-[#d6aa19] transition"
          >
            <b>View History</b>
          </button>
        </div>
      </div>
    </div>
  )
}
