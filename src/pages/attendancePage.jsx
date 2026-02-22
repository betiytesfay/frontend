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
  const [modalSession, setModalSession] = useState(null);
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


  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('currentSession', JSON.stringify(currentSession));
    } else {
      localStorage.removeItem('currentSession');
    }
  }, [currentSession]);


  useEffect(() => {
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      setCurrentSession(JSON.parse(savedSession));
      setShowAttendanceBox(true);
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
    const adminId = localStorage.getItem('adminId');
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

      const student = res.data?.data;

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

    const alreadyMarked = currentSession.students.some(
      s => s.student_id === studentData.student_id
    );

    if (alreadyMarked) {
      alert('This student is already marked present for this session.');
      return;
    }

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
          ) : (<>
            {/* Mobile Attendance List */}
            <div className="flex flex-col gap-2 sm:hidden">
              {savedSessions.map(session => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer flex justify-between items-center"
                  onClick={() => setModalSession(session)}
                >
                  <div>
                    <h3 className="font-bold">{session.date}</h3>
                    <p className="text-gray-600 text-sm">
                      Batch: {session.batchId} | Course: {courses.find(c => c.course_id === allCourseDates.find(cd => cd.date_id === session.courseDateId)?.course_id)?.course_name || 'N/A'}
                    </p>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              ))}

              {/* Modal for session details */}
              {modalSession && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-lg">
                    <h3 className="font-bold text-lg mb-2">Session: {modalSession.date}</h3>
                    <p><strong>Batch:</strong> {modalSession.batchId}</p>
                    <p><strong>Course:</strong> {courses.find(c => c.course_id === allCourseDates.find(cd => cd.date_id === modalSession.courseDateId)?.course_id)?.course_name || 'N/A'}</p>

                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Students Present:</h4>
                      <ul className="max-h-48 overflow-y-auto">
                        {modalSession.students.map(s => (
                          <li key={s.student_id} className="border-b py-1">{s.student_id} - Present</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => handleSendSessionToBackend(modalSession)}
                      >
                        Send
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => handleDeleteSession(modalSession.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={() => setModalSession(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
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


                        <button
                          onClick={() => handleExportSession(session.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                        >export </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
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

