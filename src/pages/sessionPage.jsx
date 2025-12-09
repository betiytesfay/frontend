import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import contactImage from '../assets/contact.png'
import calanderImage from '../assets/calander.png'
import bgImage from '../assets/background.png'
import { BackButton } from '../component/backButton'

export default function SessionPage() {
  const navigate = useNavigate()
  const [totalStudent, setTotalStudent] = useState(50)
  const [lastSessionDate, setLastSessionDate] = useState('2025-10-23')
  const [showHistory, setShowHistory] = useState(false)
  const [attendanceHistory, setAttendanceHistory] = useState([])

  const handleViewHistory = async () => {
    const dummyData = [
      { date: '2025-10-20', status: 'Present' },
      { date: '2025-10-21', status: 'Absent' },
      { date: '2025-10-22', status: 'Present' },
    ]
    setAttendanceHistory(dummyData)
    setShowHistory(true)
  }

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
        className="w-full sm:w-[700px] min-h-[500px] p-6 sm:p-12 rounded-xl shadow-lg text-center flex flex-col justify-center gap-8 bg-white bg-opacity-95"
      >
        <div className="flex justify-start">
          <BackButton to="/login" label="← " />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-green-700">
          <b>Welcome, Session Admin!</b>
        </h1>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <button
            onClick={() => navigate('/attendance')}
            className="flex-1 h-15 bg-white text-[#D4AF35] px-5 py-3 text-lg rounded-lg border-2 border-yellow-600 hover:bg-[#d6aa19] hover:text-white transition"
          >
            <b>Start Attendance</b>
          </button>

          <button
            onClick={() => navigate('/sessionHistory')}
            className="flex-1 h-15 bg-white text-[#D4AF35] px-5 py-3 text-lg rounded-lg border-2 border-yellow-600 hover:bg-[#d6aa19] hover:text-white transition"
          >
            <b>View History</b>
          </button>
        </div>

        {/* Stats section */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={contactImage}
              alt="Total Students"
              className="w-32 h-32 sm:w-40 sm:h-40"
            />
            <div className="text-center sm:text-left">
              <p className="text-base sm:text-lg font-semibold">
                Total Students: <span className="text-blue-600">{totalStudent}</span>
              </p>
              <p className="text-gray-600">Currently enrolled</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={calanderImage}
              alt="Calendar"
              className="w-32 h-32 sm:w-40 sm:h-40"
            />
            <div className="text-center sm:text-left">
              <p className="text-base sm:text-lg font-semibold">
                Last Session: <span className="text-gray-600">{lastSessionDate}</span>
              </p>
              <p className="text-gray-600">Attendance Record</p>
            </div>
          </div>
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
