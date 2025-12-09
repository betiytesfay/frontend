import { useState, useEffect } from 'react';
import { BackButton } from '../component/backButton';
import axios from 'axios';


import EthDatePicker from '../component/ethioDate';


export default function AttendancePage() {
  const [courseId, setCourseId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [ethDate, setEthDate] = useState('');
  const [date, setDate] = useState('');
  const [showAttendanceBox, setShowAttendanceBox] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [recordedStudents, setRecordedStudents] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [savedSessions, setSavedSessions] = useState(
    JSON.parse(localStorage.getItem('attendanceSessions')) || []
  );
  const verifySessionAdminPassword = async (enteredPassword) => {
    try {
      const res = await axios.post(
        'http://localhost:9800/auth/login',
        {
          student_id: 'sessionadmin', // hardcoded sessionadmin username
          password: enteredPassword,
          role: 'session'
        },
        { withCredentials: true }
      );


      return true;
    } catch (err) {
      return false; // login failed = incorrect password
    }
  };

  const handleDoneAttendanceWithPassword = async () => {
    // Ask for session admin password
    const enteredPassword = prompt('Enter session admin password to complete attendance:');
    if (!enteredPassword) return;

    const isValid = await verifySessionAdminPassword(enteredPassword);

    if (!isValid) {
      alert('Incorrect password!');
      return;
    }

    // If password is correct, proceed with the original handleDoneAttendance logic
    handleDoneAttendance();
  };

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    localStorage.setItem('attendanceSessions', JSON.stringify(savedSessions));
  }, [savedSessions]);

  const handleStartAttendance = () => {


    if (!courseId || !batchId || !ethDate) {  // <- use ethDate
      alert('Please fill all fields');
      return;
    }
    setDate(ethDate); // optional: store for session object
    setShowAttendanceBox(true);
  };

  // Fetch student by ID from backend
  const handleFetchStudent = async () => {
    if (!studentId || studentId.length !== 4) {
      return alert('Enter a valid 4-digit Student ID');
    }

    try {

      const res = await axios.get(
        `http://localhost:9800/student/${studentId}`,
        { withCredentials: true }
      );
      const fullName = `${res.data.first_name} ${res.data.last_name}`;
      setStudentData({
        ...res.data,
        fullName,
      });


    } catch (err) {
      if (err.response?.status === 401) {
        try {
          const refreshRes = await axios.post(
            'http://localhost:9800/auth/refresh',
            {},
            { headers: { Authorization: `Bearer ${refreshToken}` }, withCredentials: true }
          );


          const { newAccessToken, newRefreshToken } = refreshRes.data;
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);


          const res = await axios.get(
            `http://localhost:9800/student/${studentId}`,
            { withCredentials: true }
          );

          setStudentData(res.data);
        } catch (refreshErr) {
          if (refreshErr.response?.data?.message === 'REFRESH_TOKEN_EXPIRED') {
            alert('Session expired. Please login again.');
            window.location.href = '/login'; // redirect
          }

        }
      } else {
        alert('Student not found or fetch failed.');
      }



    }
  };


  const handleFinishAttendance = () => {
    if (!studentData) return;

    setRecordedStudents(prev => [...prev, studentData]);
    setToastMessage(`Attendance recorded for ${studentData.fullName}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);

    setStudentId('');
    setStudentData(null);
  };

  const handleBackToID = () => {
    setStudentData(null);
  };

  const handleDoneAttendance = async () => {
    if (recordedStudents.length === 0) return alert('No attendance to save.');

    const session = {
      id: Date.now().toString(),
      courseId,
      batchId,
      date,
      students: recordedStudents,
    };

    setSavedSessions(prev => [...prev, session]);

    // Clear current session
    setStudentId('');
    setStudentData(null);
    setShowAttendanceBox(false);
    setRecordedStudents([]);
    setToastMessage('Attendance saved locally!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);

    setCourseId('');
    setBatchId('');
    setDate('');
  };

  const handleDeleteSession = (id) => {
    const updated = savedSessions.filter(s => s.id !== id);
    setSavedSessions(updated);
    setToastMessage('Session deleted!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };
  const handleExportSession = (id) => {

  }


  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white p-6">

      <div className="p-8 rounded-xl shadow-lg w-full max-w-[700px] flex flex-col gap-6 bg-white">
        <BackButton
          onClick={async () => {
            const enteredPassword = prompt('Enter session admin password to go back:');
            if (!enteredPassword) return;

            const isValid = await verifySessionAdminPassword(enteredPassword);

            if (isValid) {
              // go back normally
              if (studentData) {
                setStudentData(null);
              } else {
                setShowAttendanceBox(false);
              }
            } else {
              alert('Incorrect password!');
            }
          }}
          label="← "
        />

        <h1 className="text-3xl font-bold text-[#D4AF35] mb-4">
          Session Attendance Setup
        </h1>

        <label>Course:</label>
        <select
          value={courseId}
          onChange={e => setCourseId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Course</option>
          <option value="first sem1">First Year semester one</option>
          <option value="first sem2">First Year semester two</option>
          <option value="second sem1">Second Year semester one</option>
          <option value="second sem2">Second Year semester two</option>
          <option value="third sem1">Third Year semester one</option>
          <option value="third sem2">Third Year semester two</option>
          <option value="fourth sem1">Fourth Year semester one</option>
          <option value="fourth sem2">Fourth Year semester two</option>
        </select>

        <label>Batch:</label>
        <select
          value={batchId}
          onChange={e => setBatchId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Batch</option>
          <option value="4th/2018">4th/2018</option>
          <option value="3rd/2018">3rd/2018</option>
          <option value="2nd/2018">2nd/2018</option>
          <option value="1st/2018">1st/2018</option>
        </select>

        <label>Date:</label>

        <EthDatePicker
          value={ethDate}
          onChange={setEthDate}
        />


        <button
          onClick={handleStartAttendance}
          className="bg-[#D4AF35] text-black py-2 px-4 rounded hover:bg-[#d6aa19] transition w-full"
        >
          Start Attendance
        </button>

        {/* Attendance Modal */}
        {showAttendanceBox && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4 relative"
              style={{ width: '400px', maxWidth: '95%', height: '330px' }}
            >

              <BackButton
                onClick={async () => {
                  const enteredPassword = prompt('Enter session admin password to go back:');
                  if (!enteredPassword) return;

                  const isValid = await verifySessionAdminPassword(enteredPassword);

                  if (isValid) {
                    // go back normally
                    if (studentData) {
                      setStudentData(null);
                    } else {
                      setShowAttendanceBox(false);
                    }
                  } else {
                    alert('Incorrect password!');
                  }
                }}
                label="← "
              />


              {!studentData ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>
                  <label>Enter Student ID:</label>
                  <input
                    type="text"
                    placeholder="1234"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    className="border p-2 rounded w-full"
                    maxLength={4}
                  />
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={handleFetchStudent}
                      className="bg-[#D4AF35]  text-white py-2 px-4 rounded hover:bg-[#d6aa19] transition flex-1"
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg  font-semibold">Student Name: {studentData.fullName}</p>
                  <p className="text-gray-600">ID: {studentData.student_id}</p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      onClick={handleFinishAttendance}
                      className="bg-[#D4AF35] text-white py-2 px-4 rounded-lg hover:bg-[#d6aa19] transition flex-1 shadow-md"
                    >
                      Mark as Present
                    </button>
                    <button
                      onClick={handleDoneAttendanceWithPassword}
                      className="bg-[#D4AF35] text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition flex-1 shadow-md"
                    >
                      Done
                    </button>


                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Saved Sessions Table */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-[#D4AF35] mb-2">Saved Attendance Sessions</h2>
          {savedSessions.length === 0 ? (
            <p className="text-gray-600">No saved sessions yet.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2">Date</th>
                  <th className="border border-gray-300 px-3 py-2">Course</th>
                  <th className="border border-gray-300 px-3 py-2">Batch</th>
                  <th className="border border-gray-300 px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedSessions.map(session => (
                  <tr key={session.id}>
                    <td className="border border-gray-300 px-3 py-2">{session.date}</td>
                    <td className="border border-gray-300 px-3 py-2">{session.courseId}</td>
                    <td className="border border-gray-300 px-3 py-2">{session.batchId}</td>
                    <td className="border border-gray-300 px-3 py-2 flex gap-2">
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleExportSession(session.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      >export </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showToast && (
          <div className="fixed bottom-10 right-10 bg-green-500 text-white py-2 px-4 rounded shadow-lg transition-opacity z-50">
            {toastMessage}
          </div>
        )}


      </div>
    </div>
  );
}
