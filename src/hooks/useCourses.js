import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/config";

export default function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/course`)
      .then((res) => setCourses(res.data.data.courses || []))
      .catch((err) => console.error("useCourses error", err))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading };
}
