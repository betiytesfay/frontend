import { apiClient } from "../lib/apiClient";

export const normalizeCourse = (raw) => {
  if (!raw) return null;
  return {
    id: raw.course_id || raw.id || null,
    name: raw.course_name || raw.name || raw.courseName || '',
    description: raw.description || raw.desc || '',
    raw,
  };
};

export const fetchCoursesApi = async () => {
  const payload = await apiClient("/course");
  const list = Array.isArray(payload) ? payload : (payload?.data || payload?.courses || []);
  return (list || []).map(normalizeCourse);
};

export const createCourseApi = async (courseData) => {
  const payload = {
    course_name: courseData.name,
    description: courseData.description,
  };
  return await apiClient("/course", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateCourseApi = async (id, courseData) => {
  const payload = {
    course_name: courseData.name,
    description: courseData.description,
  };
  return await apiClient(`/course/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const deleteCourseApi = async (id) => {
  return await apiClient(`/course/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};
