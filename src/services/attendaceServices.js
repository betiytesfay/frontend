import axios from "axios";
import { BASE_URL } from "../constants/config";

export async function getOrCreateCourseDate({ batchId, courseId, ethDate }) {
  const checkRes = await axios.get(`${BASE_URL}/course_date`, {
    params: { batch_id: batchId, course_id: courseId, class_date: ethDate },
  });

  const existing = checkRes.data?.data?.courseDates?.find(
    (cd) => cd.class_date === ethDate
  );
  if (existing) return existing.date_id;

  const createRes = await axios.post(
    `${BASE_URL}/course_date`,
    { batch_id: Number(batchId), course_id: Number(courseId), class_date: ethDate },
    { withCredentials: true }
  );

  const dateId = createRes.data?.data?.courseDate?.date_id;
  if (!dateId) throw new Error("No date_id returned from server");
  return dateId;
}

export async function verifyCourseDate(courseDateId) {
  await axios.get(`${BASE_URL}/course_date/${courseDateId}`);
}

export async function sendAttendanceSession(session) {
  await verifyCourseDate(session.courseDateId);

  const payload = {
    date_id: Number(session.courseDateId),
    students: session.students.map((s) => ({ student_id: s.student_id, is_present: true })),
    recorded_by_user_id: localStorage.getItem("adminId")
      ? Number(localStorage.getItem("adminId")) || undefined
      : undefined,
  };

  return axios.post(`${BASE_URL}/attendance`, payload, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
}

export async function sendAllAttendanceSessions(sessions) {
  let successCount = 0, duplicateCount = 0, failCount = 0;

  for (const session of sessions) {
    if (!session.students.length || !session.courseDateId) { failCount++; continue; }
    try {
      await sendAttendanceSession(session);
      successCount++;
    } catch (err) {
      if (err.response?.status === 409) duplicateCount++;
      else failCount++;
    }
  }

  return { successCount, duplicateCount, failCount };
}

export async function fetchStudentById(studentId) {
  const fullId = `UGR-${studentId.toUpperCase()}`;
  const res = await axios.get(`${BASE_URL}/student/${fullId}`, { withCredentials: true });
  const student = res.data?.data;
  if (!student?.first_name) throw new Error("Student not found");
  return { ...student, fullName: `${student.first_name} ${student.last_name}` };
}
