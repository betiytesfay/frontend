import { useState, useEffect } from 'react';
import { BackButton } from '../component/backButton';
import axios from 'axios';


import EthDatePicker from '../component/ethioDate';
const BASE_URL = "https://gibi-backend-669108940571.us-central1.run.app";

export default function AttendancePage() {
  const [batchId, setBatchId] = useState('');
  const [ethDate, setEthDate] = useState('');
  const [date, setDate] = useState('');
  const [allCourseDates, setAllCourseDates] = useState([]);
  const [filteredCourseDates, setFilteredCourseDates] = useState([]);


  const [courseDateId, setCourseDateId] = useState('');
  const [showAttendanceBox, setShowAttendanceBox] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/course`)
      .then(res => setCourses(res.data.data.courses))
      .catch(err => console.error(err));
  }, []);


  const [currentSession, setCurrentSession] = useState(null);
  useEffect(() => {
    axios.get(`${BASE_URL}/batches`)
      .then(res => setBatches(res.data.data.batches));
  }, []);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/course_date`)
      .then(res => {
        setAllCourseDates(res.data.data.course_dates);
      })
      .catch(err => console.error(err));
  }, []);

  // Save current session whenever it changes
  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('currentSession', JSON.stringify(currentSession));
    } else {
      localStorage.removeItem('currentSession');
    }
  }, [currentSession]);

  // Load it on component mount
  useEffect(() => {
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      setCurrentSession(JSON.parse(savedSession));
      setShowAttendanceBox(true); // show the attendance modal
    }
  }, []);

  const handleStartAttendance = () => {
    if (!courseDateId || !batchId || !ethDate) {
      alert('Please fill all fields');
      return;
    }

    setCurrentSession({
      courseDateId,
      batchId,
      date: ethDate,
      students: []
    });

    setShowAttendanceBox(true);
  };


  const [savedSessions, setSavedSessions] = useState(
    JSON.parse(localStorage.getItem('attendanceSessions')) || []
  );
  const verifySessionAdminPassword = async (enteredPassword) => {
    const adminId = localStorage.getItem('adminId'); // get current admin ID
    if (!adminId) {
      alert('No admin logged in!');
      return false;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/auth/login`,
        {
          student_id: adminId,
          password: enteredPassword
        },
        { withCredentials: true }
      );

      const user = res.data?.data?.user;
      if (!user) return false;

      // Check that the logged-in user is actually an admin
      return user.role === 'admin';
    } catch (err) {
      console.error('Password verification failed', err.response?.data || err);
      return false;
    }
  };


  const handleSendAllSessionsToBackend = async () => {
    if (savedSessions.length === 0) {
      alert('No sessions to send.');
      return;
    }
    try {

      for (const session of savedSessions) {
        await axios.post(
          `${BASE_URL}/attendance`,
          {
            date_id: session.courseDateId,
            students: session.students
          },
          { withCredentials: true }
        );
      }

      setSavedSessions([]);
      localStorage.removeItem('attendanceSessions');

      setToastMessage('All sessions sent to backend successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to send all sessions. Check your internet connection.');
    }
  }

  const handleDoneAttendance = () => {
    if (!currentSession || currentSession.students.length === 0) {
      alert('No attendance recorded.');
      return;
    }

    setSavedSessions(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        ...currentSession
      }
    ]);

    setCurrentSession(null);
    setShowAttendanceBox(false);
  };

  const handleDoneAttendanceWithPassword = async () => {

    const enteredPassword = prompt('Enter session admin password to complete attendance:');
    if (!enteredPassword) return;

    const isValid = await verifySessionAdminPassword(enteredPassword);

    if (!isValid) {
      alert('Incorrect password!');
      return;
    }
    handleDoneAttendance();
  };

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');


  useEffect(() => {
    if (!batchId) {
      setFilteredCourseDates([]);
      setCourseDateId('');
      return;
    }

    const selectedBatch = batches.find(b => b.batch_id === Number(batchId));

    setFilteredCourseDates(selectedBatch?.course_dates || []);
    setCourseDateId('');
  }, [batchId, batches]);



  const handleFetchStudent = async () => {
    if (!studentId) return alert('Enter a valid Student ID');

    let fullStudentId = studentId.toUpperCase();
    if (!fullStudentId.startsWith('UGR-')) {
      fullStudentId = `UGR-${fullStudentId}`;
    }

    try {
      const res = await axios.get(`${BASE_URL}/student/${fullStudentId}`, { withCredentials: true });

      const student = res.data?.data; // <-- Important: backend wraps in 'data'

      if (!student || !student.first_name) {
        alert('No student found with this ID');
        setStudentData(null);
        return;
      }

      setStudentData({
        ...student,
        fullName: `${student.first_name} ${student.last_name}`
      });

    } catch (err) {
      console.error(err);
      alert('No student found with this ID or fetch failed.');
      setStudentData(null);
    }
  };


  const handleFinishAttendance = () => {
    if (!studentData || !currentSession) return;

    setCurrentSession(prev => ({
      ...prev,
      students: [
        ...prev.students,
        {
          student_id: studentData.student_id,
          is_present: true
        }
      ]
    }));

    setToastMessage(`Attendance recorded for ${studentData.fullName}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);

    setStudentId('');
    setStudentData(null);
  };


  const handleBackToID = () => {
    setStudentData(null);
  };
  const handleFetchBatch = async () => {
    try {
      await axios.get(`${BASE_URL}/batch/${batchId}`, { withCredentials: true });
    } catch (err) {
      console.error('failed to fetch batch', err);
    }
  }

  const handleSendSessionToBackend = async (session) => {
    try {
      await axios.post(
        `${BASE_URL}/attendance`,
        {
          date_id: session.courseDateId,
          students: session.students
        },
        { withCredentials: true }
      );

      // Remove session from local storage after successful send
      setSavedSessions(prev => prev.filter(s => s.id !== session.id));
      setToastMessage('Session sent to backend successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to send session to backend. Check your internet connection.');
    }
  };

  const handleDeleteSession = (id) => {
    const updated = savedSessions.filter(s => s.id !== id);
    setSavedSessions(updated);
    setToastMessage('Session deleted!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleExportSession = (id) => {
    const session = savedSessions.find(s => s.id === id);
    if (!session) return;

    const dataStr = JSON.stringify(session, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `session_${id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white p-6">

      <div className="p-8 rounded-xl shadow-lg w-full max-w-[700px] flex flex-col gap-6 bg-white">
        <BackButton
          onClick={async () => {
            const enteredPassword = prompt('Enter session admin password to go back:');
            if (!enteredPassword) return;

            const isValid = await verifySessionAdminPassword(enteredPassword);

            if (isValid) {

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


        <label>Batch:</label>
        <select
          value={batchId}
          onChange={e => setBatchId(e.target.value)}
          className="border p-2 rounded w-full max-w-full"
        >
          <option value="">Select Batch</option>
          {batches.map(batch => (
            <option key={batch.batch_id} value={batch.batch_id}>
              {batch.batch_name}
            </option>
          ))}
        </select>
        <label>Course & Date:</label>

        <select
          value={courseDateId}
          onChange={e => setCourseDateId(e.target.value)}
          className="border p-2 rounded w-full max-w-full truncate"
        >

          <option value="">Select course</option>
          {filteredCourseDates.map(cd => {
            const courseName = courses.find(c => c.course_id === cd.course_id)?.course_name || 'Unknown';
            return (
              <option key={cd.date_id} value={cd.date_id}>
                {courseName}
              </option>
            );
          })}
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

                    setShowAttendanceBox(false);

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
                    placeholder="1234-16"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    className="border p-2 rounded w-full"
                    maxLength={7}
                  />
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={handleFetchStudent}
                      className="bg-[#D4AF35]  text-white py-2 px-4 rounded hover:bg-[#d6aa19] transition flex-1"
                    >
                      Next
                    </button>
                    <button
                      onClick={handleDoneAttendanceWithPassword}
                      className="bg-[#D4AF35] text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition flex-1 shadow-md"
                    >
                      Done
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
                      className="bg-[#D4AF35] text-white py-2 px-4 mt-2 rounded-lg hover:bg-[#d6aa19] transition flex-1 shadow-md"
                    >
                      Mark as Present
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
                    <td className="border border-gray-300 px-3 py-2">
                      {Array.isArray(allCourseDates) && allCourseDates.length > 0
                        ? allCourseDates.find(cd => cd.date_id === session.courseDateId)?.course_name || 'N/A'
                        : 'Loading...'}
                    </td>



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
        {savedSessions.length > 0 && (
          <button
            onClick={handleSendAllSessionsToBackend}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mb-4"
          >
            Send All Sessions to Backend
          </button>
        )}


        {showToast && (
          <div className="fixed bottom-10 right-10 bg-green-500 text-white py-2 px-4 rounded shadow-lg transition-opacity z-50">
            {toastMessage}
          </div>
        )}

      </div>
    </div>
  );
}

