import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL =
  "https://gibi-backend-669108940571.us-central1.run.app";

export default function useAttendanceData() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courseDates, setCourseDates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    const res = await axios.get(`${BASE_URL}/course`);
    setCourses(res.data.data.courses);
  };

  const fetchBatches = async () => {
    const res = await axios.get(`${BASE_URL}/batches`);
    setBatches(res.data.data.batches);
  };

  const fetchCourseDates = async () => {
    const res = await axios.get(`${BASE_URL}/course_date`);
    setCourseDates(res.data.data.courseDates);
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchCourses(),
          fetchBatches(),
          fetchCourseDates(),
        ]);
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  return {
    courses,
    batches,
    courseDates,
    loading,
    refresh: loadAll,
  };
}