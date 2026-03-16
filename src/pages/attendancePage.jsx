import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../component/backButton';
import axios from 'axios';
import EthDatePicker from '../component/ethioDate';

const BASE_URL = "https://gibi-backend-669108940571.us-central1.run.app";

export default function AttendancePage() {
  const navigate = useNavigate();
  const [batchId, setBatchId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [ethDate, setEthDate] = useState('');
  const [loading, setLoading] = useState(false);
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
  const [currentSession, setCurrentSession] = useState(null);
  const [savedSessions, setSavedSessions] = useState([]);

  // Load saved sessions and filter out invalid ones
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('attendanceSessions')) || [];
    // Filter out sessions without courseDateId
    const validSessions = saved.filter(s => s.courseDateId);
    setSavedSessions(validSessions);
  }, []);

  // Fetch initial data
  useEffect(() => {
    axios.get(`${BASE_URL}/course`)
      .then(res => setCourses(res.data.data.courses))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/batches`)
      .then(res => setBatches(res.data.data.batches));
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/course_date`)
      .then(res => {
        setAllCourseDates(res.data.data.courseDates);
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

  useEffect(() => {
    localStorage.setItem('attendanceSessions', JSON.stringify(savedSessions));
  }, [savedSessions]);

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
      return user?.role === 'admin';
    } catch (err) {
      console.error('Password verification failed', err.response?.data || err);
      return false;
    }
  };

  const handleStartAttendance = async () => {
    if (!batchId || !courseId || !ethDate) {
      alert('Please select batch, course, and date');
      return;
    }

    setLoading(true);

    try {
      // First, check if this course_date already exists
      const checkResponse = await axios.get(`${BASE_URL}/course_date`, {
        params: {
          batch_id: batchId,
          course_id: courseId,
          class_date: ethDate
        }
      });

      console.log('Check existing course_date:', checkResponse.data);

      let courseDateId = null;

      // Check if course_date exists
      if (checkResponse.data?.data?.courseDates?.length > 0) {
        const exactMatch = checkResponse.data.data.courseDates.find(
          cd => cd.class_date === ethDate
        );

        if (exactMatch) {
          courseDateId = exactMatch.date_id;
          console.log('✅ Found EXACT matching course_date ID:', courseDateId);
        }
      }

      // If no exact match found, create a new one
      if (!courseDateId) {
        const courseDatePayload = {
          batch_id: Number(batchId),
          course_id: Number(courseId),
          class_date: ethDate,
        };

        console.log('Creating NEW course_date with payload:', courseDatePayload);

        const courseDateResponse = await axios.post(
          `${BASE_URL}/course_date`,
          courseDatePayload,
          { withCredentials: true }
        );

        console.log('Course date creation response:', courseDateResponse.data);

        // FIXED: Get date_id from the correct path
        courseDateId = courseDateResponse.data?.data?.courseDate?.date_id;

        if (!courseDateId) {
          console.error('Full response:', courseDateResponse.data);
          throw new Error('No date_id returned from server');
        }

        console.log('✅ Created NEW course_date ID:', courseDateId);
      }

      // Verify the course_date exists
      try {
        await axios.get(`${BASE_URL}/course_date/${courseDateId}`);
        console.log(`✅ Verified course_date ${courseDateId} exists in database`);
      } catch (verifyErr) {
        console.error('Verification failed:', verifyErr);
        throw new Error(`Course date ${courseDateId} was not found after creation`);
      }

      // Now we have a valid courseDateId
      setCurrentSession({
        courseDateId: courseDateId,
        batchId,
        courseId,
        date: ethDate,
        students: []
      });

      setShowAttendanceBox(true);
      setToastMessage('Session started successfully!');

    } catch (err) {
      console.error('Error in handleStartAttendance:', err);

      if (err.response) {
        console.log('Error status:', err.response.status);
        console.log('Error data:', err.response.data);
        alert(`Failed to create session: ${err.response.data?.message || err.message}`);
      } else {
        alert(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleSendSessionToBackend = async (session) => {
    if (!session?.students?.length) {
      alert('No students to send for this session.');
      return;
    }

    if (!session.courseDateId) {
      alert('This session has no valid course date ID. Please create a new session.');
      return;
    }

    setLoading(true);

    try {

      try {
        await axios.get(`${BASE_URL}/course_date/${session.courseDateId}`);
        console.log(`✅ Verified course_date ${session.courseDateId} exists`);
      } catch (err) {
        alert(`Course date ID ${session.courseDateId} does not exist in database! Please create the session again.`);
        return;
      }

      // Format students - student enters only number, we add UGR-
      const formattedStudents = session.students.map(s => {

        return {
          student_id: s.student_id,
          is_present: true
        };
      });

      const payload = {
        date_id: Number(session.courseDateId),
        students: formattedStudents,
        recorded_by_user_id: localStorage.getItem('adminId') ? Number(localStorage.getItem('adminId')) : undefined
      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2));

      const response = await axios.post(`${BASE_URL}/attendance`, payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Success:', response.data);

      // Remove the successfully sent session
      setSavedSessions(prev => prev.filter(s => s.id !== session.id));
      setToastMessage('Session sent successfully!');

      if (modalSession?.id === session.id) {
        setModalSession(null);
      }

    } catch (err) {
      console.error('Error sending session:', err);

      if (err.response) {
        console.log('Error status:', err.response.status);
        console.log('Error data:', err.response.data);

        // Handle 409 Conflict (duplicate entries)
        if (err.response.status === 409) {
          const shouldRemove = window.confirm(
            'Attendance for this session already exists in the database. Would you like to remove it from your saved list?'
          );

          if (shouldRemove) {
            setSavedSessions(prev => prev.filter(s => s.id !== session.id));
            if (modalSession?.id === session.id) {
              setModalSession(null);
            }
            setToastMessage('Session removed from saved list (already in database).');
          }
        }
        // Handle 400 Bad Request (foreign key constraint)
        else if (err.response.status === 400) {
          if (err.response.data?.message?.includes('Foreign key constraint')) {
            alert('Some students do not exist in the database. Please check student IDs.');
          } else {
            alert(`Error: ${err.response.data?.message || 'Bad request'}`);
          }
        }
        else {
          alert(`Error: ${err.response.data?.message || 'Failed to send session'}`);
        }
      } else {
        alert('Network error. Please check your connection.');
      }
    } finally {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      setLoading(false);
    }
  };

  // FIXED: Handle sending all sessions
  const handleSendAllSessionsToBackend = async () => {
    if (savedSessions.length === 0) return;

    setLoading(true);
    let successCount = 0;
    let duplicateCount = 0;
    let failCount = 0;

    try {
      for (const session of savedSessions) {
        if (session.students.length === 0) continue;

        // Skip sessions without courseDateId
        if (!session.courseDateId) {
          console.log(`Skipping session ${session.id} - no courseDateId`);
          failCount++;
          continue;
        }

        try {
          // First verify course_date exists
          try {
            await axios.get(`${BASE_URL}/course_date/${session.courseDateId}`);
          } catch (err) {
            console.log(`Skipping session ${session.id} - course_date not found for ID: ${session.courseDateId}`);
            failCount++;
            continue;
          }

          const formattedStudents = session.students.map(s => ({
            student_id: s.student_id, // Already has UGR-
            is_present: true
          }));

          const payload = {
            date_id: Number(session.courseDateId),
            students: formattedStudents,
            recorded_by_user_id: localStorage.getItem('adminId') ? Number(localStorage.getItem('adminId')) : undefined,
          };

          await axios.post(`${BASE_URL}/attendance`, payload, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });

          successCount++;

        } catch (err) {
          if (err.response?.status === 409) {
            duplicateCount++;
            console.log(`Session ${session.id} already exists in database`);
          } else {
            console.error(`Failed to send session ${session.id}:`, err);
            failCount++;
          }
        }
      }

      // Remove all sessions that were successfully sent or already existed
      if (successCount > 0 || duplicateCount > 0) {
        setSavedSessions([]);
      }

      setToastMessage(`✅ Sent: ${successCount}, ⚠️ Already existed: ${duplicateCount}, ❌ Failed: ${failCount}`);

    } catch (err) {
      console.error('Error:', err);
      setToastMessage('Error sending sessions.');
    } finally {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      setLoading(false);
    }
  };

  const handleDoneAttendance = () => {
    if (!currentSession || currentSession.students.length === 0) {
      alert('No attendance recorded.');
      return;
    }

    // Check if session for this date already exists
    const existingSession = savedSessions.find(
      s => s.courseDateId === currentSession.courseDateId
    );

    if (existingSession) {
      const shouldReplace = window.confirm(
        'A session for this date already exists. Do you want to replace it?'
      );

      if (!shouldReplace) return;

      setSavedSessions(prev => prev.filter(s => s.courseDateId !== currentSession.courseDateId));
    }

    // Format and save new session
    const formattedSession = {
      id: Date.now().toString(),
      courseDateId: currentSession.courseDateId,
      batchId: currentSession.batchId,
      courseId: currentSession.courseId,
      date: currentSession.date,
      students: currentSession.students.map(s => ({
        student_id: s.student_id, // Already has UGR-
        is_present: true,
        name: s.name,
        gender: s.gender,
        department: s.department
      }))
    };

    setSavedSessions(prev => [...prev, formattedSession]);
    setCurrentSession(null);
    setStudentData(null);
    setStudentId('');
    setShowAttendanceBox(false);
    setToastMessage('Session saved locally!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
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

  // FIXED: Student only enters the number part, we add UGR- automatically
  const handleFetchStudent = async () => {
    if (!studentId) return alert('Enter a valid Student ID');

    // Student enters only the number part (e.g., "1326-16")
    // We add UGR- automatically
    let fullStudentId = `UGR-${studentId.toUpperCase()}`;

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
          student_id: studentData.student_id, // Already has UGR- from fetch
          is_present: true,
          name: studentData.fullName,
          gender: studentData.gender || 'Unknown',
          department: studentData.department || 'Unknown'
        }
      ]
    }));

    setToastMessage(`Attendance recorded for ${studentData.fullName}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);

    setStudentId('');
    setStudentData(null);
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

  const getCourseNameByDateId = (dateId) => {
    if (!Array.isArray(allCourseDates) || !Array.isArray(courses)) {
      return 'Loading...';
    }

    const courseDate = allCourseDates.find(cd => cd.date_id === dateId);
    if (!courseDate) return 'N/A';

    const course = courses.find(c => c.course_id === courseDate.course_id);
    return course?.course_name || 'N/A';
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
                setStudentId('');
              } else {
                setShowAttendanceBox(false);
              }
            } else {
              alert('Incorrect password!');
            }
            navigate("/sessionAdmin");
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
          className="border p-2 rounded w-full"
        >
          <option value="">Select Batch</option>
          {batches.map(batch => (
            <option key={batch.batch_id} value={batch.batch_id}>
              {batch.batch_name}
            </option>
          ))}
        </select>

        <label>Course:</label>
        <select
          value={courseId}
          onChange={e => setCourseId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_name}
            </option>
          ))}
        </select>

        <label>Date:</label>
        <EthDatePicker
          value={ethDate}
          onChange={setEthDate}
        />

        <button
          onClick={handleStartAttendance}
          disabled={loading}
          className="bg-[#D4AF35] text-black py-2 px-4 rounded hover:bg-[#d6aa19] transition w-full disabled:opacity-50"
        >
          {loading ? 'Creating Session...' : 'Start Attendance'}
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
                  <label>Enter Student ID (number only):</label>
                  <input
                    type="text"
                    placeholder="1326-16"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    className="border p-2 rounded w-full"
                  />

                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={handleFetchStudent}
                      className="bg-[#D4AF35] text-white py-2 px-4 rounded hover:bg-[#d6aa19] transition flex-1"
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
                  <p className="text-lg font-semibold">Student Name: {studentData.fullName}</p>
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

        {/* Saved Sessions Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-[#D4AF35] mb-2">Saved Attendance Sessions</h2>
          {savedSessions.length === 0 ? (
            <p className="text-gray-600">No saved sessions yet.</p>
          ) : (
            <>
              {/* Mobile View */}
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
                        Batch: {session.batchId} | Course: {getCourseNameByDateId(session.courseDateId)}
                      </p>
                    </div>
                    <div className="text-gray-400">→</div>
                  </div>
                ))}

                {/* Session Details Modal */}
                {modalSession && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-lg">
                      <h3 className="font-bold text-lg mb-2">Session: {modalSession.date}</h3>
                      <p><strong>Batch:</strong> {modalSession.batchId}</p>
                      <p>
                        <strong>Course:</strong> {getCourseNameByDateId(modalSession.courseDateId)}
                      </p>
                      <p><strong>Date ID:</strong> {modalSession.courseDateId}</p>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Students Present:</h4>
                        <ul className="max-h-48 overflow-y-auto">
                          {modalSession.students.map(s => (
                            <li key={s.student_id} className="border-b py-1">
                              {s.student_id} - {s.name || 'Present'}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1"
                          onClick={() => handleSendSessionToBackend(modalSession)}
                          disabled={loading}
                        >
                          {loading ? 'Sending...' : 'Send'}
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
                          onClick={() => handleDeleteSession(modalSession.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 flex-1"
                          onClick={() => setModalSession(null)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2">Date</th>
                      <th className="border border-gray-300 px-3 py-2">Course</th>
                      <th className="border border-gray-300 px-3 py-2">Batch</th>
                      <th className="border border-gray-300 px-3 py-2">Students</th>
                      <th className="border border-gray-300 px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedSessions.map(session => (
                      <tr key={session.id}>
                        <td className="border border-gray-300 px-3 py-2">{session.date}</td>
                        <td className="border border-gray-300 px-3 py-2">
                          {getCourseNameByDateId(session.courseDateId)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">{session.batchId}</td>
                        <td className="border border-gray-300 px-3 py-2">{session.students.length}</td>
                        <td className="border border-gray-300 px-3 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSendSessionToBackend(session)}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-xs"
                              disabled={loading}
                            >
                              {loading ? '...' : 'Send'}
                            </button>
                            <button
                              onClick={() => handleDeleteSession(session.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleExportSession(session.id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs"
                            >
                              Export
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Send All Button */}
        {savedSessions.length > 0 && (
          <button
            onClick={handleSendAllSessionsToBackend}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mb-4 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send All Sessions to Backend'}
          </button>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-10 right-10 bg-green-500 text-white py-2 px-4 rounded shadow-lg transition-opacity z-50">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}