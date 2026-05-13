const BASE = "https://gibi-backend-669108940571.us-central1.run.app";

/**
 * Small helper to handle API responses
 */
const handleResponse = async (res) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data?.message || data?.error || "Something went wrong with the request";
    throw new Error(message);
  }

  return data;
};

/**
 * GET all students
 */
export const getStudents = async () => {
  const res = await fetch(`${BASE}/student`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return handleResponse(res);
};

/**
 * CREATE student
 */
export const addStudent = async (student) => {
  const res = await fetch(`${BASE}/student`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(student),
  });

  return handleResponse(res);
};

/**
 * UPDATE student
 */
export const updateStudent = async (id, student) => {
  const res = await fetch(`${BASE}/student/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(student),
  });

  return handleResponse(res);
};

/**
 * DELETE student
 */
export const deleteStudent = async (id) => {
  const res = await fetch(`${BASE}/student/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return handleResponse(res);
};