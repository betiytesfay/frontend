import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "et-calendar";
import { EthiopianDate } from "et-calendar/lib";
import { BackButton } from "../component/backButton";
import useCourses from "../hooks/useCourses";
import useBatches from "../hooks/useBatches";
import useAttendanceSession from "../hooks/useAttendaceSession";
import { verifySessionAdminPassword } from "../services/authServices";
import { fetchStudentById } from "../services/attendaceServices";

export default function AttendancePage() {
  const navigate = useNavigate();

  const [batchId, setBatchId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [ethDate, setEthDate] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [showAttendanceBox, setShowAttendanceBox] = useState(false);
  const [modalSession, setModalSession] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { courses } = useCourses();
  const { batches } = useBatches();
  const {
    currentSession,
    savedSessions,
    loading,
    startSession,
    addStudent,
    finishSession,
    deleteSession,
    sendSession,
    sendAllSessions,
  } = useAttendanceSession();

  const toast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const getCourseNameById = (courseId) =>
    courses.find((c) => c.course_id === courseId)?.course_name || "N/A";

  const handleStartAttendance = async () => {
    if (!batchId || !courseId || !ethDate) {
      alert("Please select batch, course, and date");
      return;
    }
    try {
      await startSession({ batchId, courseId, ethDate });
      setShowAttendanceBox(true);
      toast("Session started successfully!");
    } catch (err) {
      alert(`Failed to create session: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleFetchStudent = async () => {
    if (!studentId) return alert("Enter a valid Student ID");
    try {
      const student = await fetchStudentById(studentId);
      setStudentData(student);
    } catch {
      alert("No student found with this ID.");
      setStudentData(null);
    }
  };

  const handleMarkPresent = () => {
    if (!studentData) return;
    const added = addStudent(studentData);
    if (!added) {
      alert("This student is already marked present.");
      return;
    }
    toast(`Attendance recorded for ${studentData.fullName}!`);
    setStudentId("");
    setStudentData(null);
  };

  const handleDoneWithPassword = async () => {
    const pwd = prompt("Enter session admin password to complete attendance:");
    if (!pwd) return;
    const valid = await verifySessionAdminPassword(pwd);
    if (!valid) return alert("Incorrect password!");

    if (!currentSession?.students?.length) return alert("No attendance recorded.");

    const existing = savedSessions.find((s) => s.courseDateId === currentSession.courseDateId);
    if (existing) {
      if (!window.confirm("A session for this date already exists. Replace it?")) return;
      deleteSession(existing.id);
    }

    finishSession();
    setStudentData(null);
    setStudentId("");
    setShowAttendanceBox(false);
    toast("Session saved locally!");
  };

  const handleSendSession = async (session) => {
    if (!session?.students?.length) return alert("No students in this session.");
    try {
      await sendSession(session);
      toast("Session sent successfully!");
      if (modalSession?.id === session.id) setModalSession(null);
    } catch (err) {
      if (err.response?.status === 409) {
        if (window.confirm("Already exists in database. Remove from saved list?")) {
          deleteSession(session.id);
          if (modalSession?.id === session.id) setModalSession(null);
          toast("Removed from saved list.");
        }
      } else if (err.response?.status === 400) {
        alert(
          err.response.data?.message?.includes("Foreign key")
            ? "Some students do not exist in the database."
            : `Error: ${err.response.data?.message || "Bad request"}`
        );
      } else {
        alert("Network error. Please check your connection.");
      }
    }
  };

  const handleSendAll = async () => {
    const { successCount, duplicateCount, failCount } = await sendAllSessions();
    toast(`✅ Sent: ${successCount}, ⚠️ Already existed: ${duplicateCount}, ❌ Failed: ${failCount}`);
  };

  const handleExportSession = (session) => {
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `session_${session.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBack = async () => {
    const pwd = prompt("Enter session admin password to go back:");
    if (!pwd) return;
    const valid = await verifySessionAdminPassword(pwd);
    if (!valid) return alert("Incorrect password!");
    navigate("/sessionPage");
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white p-6">
      <div className="p-8 rounded-xl shadow-lg w-full max-w-[700px] flex flex-col gap-6 bg-white">
        <BackButton onClick={handleBack} label="← " />

        <h1 className="text-3xl font-bold text-[#D4AF35]">Session Attendance Setup</h1>

        <label>Batch:</label>
        <select value={batchId} onChange={(e) => setBatchId(e.target.value)} className="border p-2 rounded w-full">
          <option value="">Select Batch</option>
          {batches.map((b) => (
            <option key={b.batch_id} value={b.batch_id}>{b.batch_name}</option>
          ))}
        </select>

        <label>Course:</label>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="border p-2 rounded w-full">
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.course_id} value={c.course_id}>{c.course_name}</option>
          ))}
        </select>

        <label>Date:</label>
        <div className="border rounded w-full max-w-xs">
          <DatePicker
            selectedDate={new Date()}
            onDateChange={(date) => {
              const eth = EthiopianDate.toEth(date);
              const y = eth.Year;
              const m = String(eth.Month).padStart(2, '0');
              const d = String(eth.Day).padStart(2, '0');
              setEthDate(`${y}-${m}-${d}`);
            }}
            showCalendars="ethiopian"
            viewFirst="Ethiopian"
            closeOnSelect
          />
        </div>
        {ethDate && <p className="text-sm text-gray-500">Selected: {ethDate}</p>}

        <button
          onClick={handleStartAttendance}
          disabled={loading}
          className="bg-[#D4AF35] text-black py-2 px-4 rounded hover:bg-[#d6aa19] transition w-full disabled:opacity-50"
        >
          {loading ? "Creating Session..." : "Start Attendance"}
        </button>

        {/* Attendance Modal */}
        {showAttendanceBox && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4 relative w-[400px] max-w-[95%] h-[330px]">
              <BackButton
                onClick={async () => {
                  const pwd = prompt("Enter session admin password to go back:");
                  if (!pwd) return;
                  const valid = await verifySessionAdminPassword(pwd);
                  if (valid) setShowAttendanceBox(false);
                  else alert("Incorrect password!");
                }}
                label="← "
              />

              {!studentData ? (
                <>
                  <h2 className="text-2xl font-bold">Mark Attendance</h2>
                  <label>Enter Student ID (number only):</label>
                  <input
                    type="text"
                    placeholder="1326-16"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFetchStudent()}
                    className="border p-2 rounded w-full"
                  />
                  <div className="flex gap-4 mt-2">
                    <button onClick={handleFetchStudent} className="bg-[#D4AF35] text-white py-2 px-4 rounded hover:bg-[#d6aa19] transition flex-1">
                      Next
                    </button>
                    <button onClick={handleDoneWithPassword} className="bg-[#D4AF35] text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition flex-1">
                      Done
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold">Student Name: {studentData.fullName}</p>
                  <p className="text-gray-600">ID: {studentData.student_id}</p>
                  <button onClick={handleMarkPresent} className="bg-[#D4AF35] text-white py-2 px-4 mt-2 rounded-lg hover:bg-[#d6aa19] transition">
                    Mark as Present
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Saved Sessions */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-[#D4AF35] mb-2">Saved Attendance Sessions</h2>
          {savedSessions.length === 0 ? (
            <p className="text-gray-600">No saved sessions yet.</p>
          ) : (
            <>
              {/* Mobile */}
              <div className="flex flex-col gap-2 sm:hidden">
                {savedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="border rounded-lg p-4 shadow-sm cursor-pointer flex justify-between items-center"
                    onClick={() => setModalSession(session)}
                  >
                    <div>
                      <h3 className="font-bold">{session.date}</h3>
                      <p className="text-gray-600 text-sm">
                        Batch: {session.batchId} | Course: {getCourseNameById(session.courseId)}
                      </p>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                ))}

                {modalSession && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-lg">
                      <h3 className="font-bold text-lg mb-2">Session: {modalSession.date}</h3>
                      <p><strong>Batch:</strong> {modalSession.batchId}</p>
                      <p><strong>Course:</strong> {getCourseNameById(modalSession.courseId)}</p>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Students Present:</h4>
                        <ul className="max-h-48 overflow-y-auto">
                          {modalSession.students.map((s) => (
                            <li key={s.student_id} className="border-b py-1">
                              {s.student_id} - {s.name || "Present"}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => handleSendSession(modalSession)} disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1">
                          {loading ? "Sending..." : "Send"}
                        </button>
                        <button onClick={() => { deleteSession(modalSession.id); setModalSession(null); }} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1">
                          Delete
                        </button>
                        <button onClick={() => setModalSession(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 flex-1">
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop */}
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
                    {savedSessions.map((session) => (
                      <tr key={session.id}>
                        <td className="border border-gray-300 px-3 py-2">{session.date}</td>
                        <td className="border border-gray-300 px-3 py-2">{getCourseNameById(session.courseId)}</td>
                        <td className="border border-gray-300 px-3 py-2">{session.batchId}</td>
                        <td className="border border-gray-300 px-3 py-2">{session.students.length}</td>
                        <td className="border border-gray-300 px-3 py-2">
                          <div className="flex gap-2">
                            <button onClick={() => handleSendSession(session)} disabled={loading} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs">
                              {loading ? "..." : "Send"}
                            </button>
                            <button onClick={() => deleteSession(session.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">
                              Delete
                            </button>
                            <button onClick={() => handleExportSession(session)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs">
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

        {savedSessions.length > 0 && (
          <button onClick={handleSendAll} disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50">
            {loading ? "Sending..." : "Send All Sessions to Backend"}
          </button>
        )}

        {showToast && (
          <div className="fixed bottom-10 right-10 bg-green-500 text-white py-2 px-4 rounded shadow-lg z-50">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
