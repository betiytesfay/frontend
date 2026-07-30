import { apiClient } from "../lib/apiClient";

export const normalizeUser = (raw) => {
  if (!raw) return null;
  return {
    user_id: raw.user_id || raw.id || raw.userId || null,
    username: raw.username || raw.name || raw.user || '',
    email: raw.email || raw.email_address || '',
    role: raw.role || 'admin',
    student_id: raw.student_id || raw.studentId || null,
    raw,
  };
};

export const fetchUsersApi = async () => {
  const payload = await apiClient("/user");
  const list = Array.isArray(payload) ? payload : (payload?.data || payload?.users || []);
  return (list || []).map(normalizeUser);
};

export const fetchUserByIdApi = async (id) => {
  const data = await apiClient(`/user/${encodeURIComponent(id)}`);
  return normalizeUser(data?.data || data);
};

export const createUserApi = async (userData) => {
  const payload = {
    username: userData.username,
    student_id: userData.studentId,
    password_hash: userData.password,
    role: userData.role,
    email: userData.email,
  };
  return await apiClient("/user/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateUserApi = async (userData) => {
  const payload = {
    username: userData.username,
    student_id: userData.studentId,
    password: userData.password || undefined,
    email: userData.email,
  };
  return await apiClient("/user/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const deleteUserApi = async (id) => {
  return await apiClient(`/user/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};
