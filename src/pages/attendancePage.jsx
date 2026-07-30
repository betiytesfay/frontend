import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../component/backButton";
import useCourses from "../hooks/useCourses";
import useBatches from "../hooks/useBatches";
import useAttendanceSession from "../hooks/useAttendaceSession";
import { verifySessionAdminPassword } from "../services/authServices";
import { fetchStudentById } from "../services/attendaceServices";
import { AttendanceSessionForm } from "../component/attendance/AttendanceSessionForm";
import { AttendanceMarkModal } from "../component/attendance/AttendanceMarkModal";
import { AttendanceSavedSessions } from "../component/attendance/AttendanceSavedSessions";

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

  const getCourseNameById = (cId) =>
    courses.find((c) => (c.course_id || c.id) === cId)?.course_name || "N/A";

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
    if (!added) return alert("This student is already marked present.");
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
      } else {
        alert(`Error sending session: ${err.message}`);
      }
    }
  };

  const handleSendAll = async () => {
    const { successCount, duplicateCount, failCount } = await sendAllSessions();
    toast(`✅ Sent: ${successCount}, ⚠️ Existed: ${duplicateCount}, ❌ Failed: ${failCount}`);
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
      <div className="p-8 rounded-xl shadow-lg w-full max-w-[700px] flex flex-col gap-6 bg-white overflow-y-auto max-h-[95vh]">
        <BackButton onClick={handleBack} label="← " />

        <AttendanceSessionForm
          batchId={batchId} setBatchId={setBatchId}
          courseId={courseId} setCourseId={setCourseId}
          ethDate={ethDate} setEthDate={setEthDate}
          batches={batches} courses={courses}
          handleStartAttendance={handleStartAttendance}
          loading={loading}
        />

        <AttendanceMarkModal
          showAttendanceBox={showAttendanceBox}
          setShowAttendanceBox={setShowAttendanceBox}
          studentData={studentData}
          studentId={studentId} setStudentId={setStudentId}
          handleFetchStudent={handleFetchStudent}
          handleMarkPresent={handleMarkPresent}
          handleDoneWithPassword={handleDoneWithPassword}
        />

        <AttendanceSavedSessions
          savedSessions={savedSessions}
          modalSession={modalSession} setModalSession={setModalSession}
          getCourseNameById={getCourseNameById}
          handleSendSession={handleSendSession}
          deleteSession={deleteSession}
          handleExportSession={handleExportSession}
          handleSendAll={handleSendAll}
          loading={loading}
        />

        {showToast && (
          <div className="fixed bottom-10 right-10 bg-green-500 text-white py-2 px-4 rounded shadow-lg z-50">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
