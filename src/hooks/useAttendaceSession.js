import { useEffect, useState } from "react";
import {
  getOrCreateCourseDate,
  verifyCourseDate,
  sendAttendanceSession,
  sendAllAttendanceSessions,
} from "../services/attendaceServices";

export default function useAttendanceSession() {
  const [currentSession, setCurrentSession] = useState(null);
  const [savedSessions, setSavedSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("attendanceSessions")) || [];
    setSavedSessions(saved.filter((s) => s.courseDateId));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "attendanceSessions",
      JSON.stringify(savedSessions)
    );
  }, [savedSessions]);

  useEffect(() => {
    if (currentSession) {
      localStorage.setItem(
        "currentSession",
        JSON.stringify(currentSession)
      );
    } else {
      localStorage.removeItem("currentSession");
    }
  }, [currentSession]);

  const startSession = async ({ batchId, courseId, ethDate }) => {
    setLoading(true);

    try {
      const courseDateId = await getOrCreateCourseDate({
        batchId,
        courseId,
        ethDate,
      });

      await verifyCourseDate(courseDateId);

      setCurrentSession({
        courseDateId,
        batchId,
        courseId,
        date: ethDate,
        students: [],
      });

      return courseDateId;
    } finally {
      setLoading(false);
    }
  };

  const addStudent = (student) => {
    if (!currentSession) return false;

    const exists = currentSession.students.some(
      (s) => s.student_id === student.student_id
    );

    if (exists) return false;

    setCurrentSession((prev) => ({
      ...prev,
      students: [
        ...prev.students,
        {
          student_id: student.student_id,
          is_present: true,
          name: student.fullName,
          gender: student.gender,
          department: student.department,
        },
      ],
    }));

    return true;
  };

  const finishSession = () => {
    if (!currentSession?.students?.length) return;

    const session = {
      id: Date.now().toString(),
      ...currentSession,
    };

    setSavedSessions((prev) => [...prev, session]);
    setCurrentSession(null);

    return session;
  };

  const deleteSession = (id) => {
    setSavedSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const sendSession = async (session) => {
    setLoading(true);

    try {
      await sendAttendanceSession(session);

      setSavedSessions((prev) =>
        prev.filter((s) => s.id !== session.id)
      );
    } finally {
      setLoading(false);
    }
  };

  const sendAllSessions = async () => {
    setLoading(true);

    try {
      const result = await sendAllAttendanceSessions(savedSessions);
      setSavedSessions([]);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentSession,
    savedSessions,
    loading,

    startSession,
    addStudent,
    finishSession,
    deleteSession,
    sendSession,
    sendAllSessions,

    setCurrentSession,
  };
}