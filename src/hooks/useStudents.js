import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/config";

export default function useStudents() {
  const [studentData, setStudentData] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);

  const fetchStudent = async (studentIdInput) => {
    if (!studentIdInput) return;

    setLoadingStudent(true);

    const fullStudentId = `UGR-${studentIdInput.toUpperCase()}`;

    try {
      const res = await axios.get(`${BASE_URL}/student/${fullStudentId}`, {
        withCredentials: true,
      });

      const student = res.data?.data;

      if (!student || !student.first_name) {
        setStudentData(null);
        return null;
      }

      const formatted = {
        ...student,
        fullName: `${student.first_name} ${student.last_name}`,
      };

      setStudentData(formatted);
      return formatted;
    } catch (err) {
      console.error("Student fetch failed:", err);
      setStudentData(null);
      return null;
    } finally {
      setLoadingStudent(false);
    }
  };

  const clearStudent = () => setStudentData(null);

  return {
    studentData,
    loadingStudent,
    fetchStudent,
    clearStudent,
  };
}