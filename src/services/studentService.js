import { toEthiopian } from 'ethiopian-date';

export const BASE = "https://gibi-backend-669108940571.us-central1.run.app";

export const normalizeStudent = (raw) => {
  if (!raw) return null;
  return {
    id: raw.student_id || raw.id || raw.student_id_value || String(raw.student_id || raw.id || ''),
    firstname: raw.first_name || raw.firstname || raw.firstName || raw.name || '',
    lastname: raw.last_name || raw.lastname || raw.lastName || '',
    email: raw.email || raw.email_address || '',
    phone: raw.phone_number || raw.phone || raw.phoneNumber || '',
    department: raw.department || raw.dept || '',
    gender: raw.gender || 'male',
    raw,
  };
};

export const fetchStudentsApi = async () => {
  const res = await fetch(`${BASE}/student`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Failed to fetch students: ${res.status}`);

  const payload = await res.json();
  const list = Array.isArray(payload) ? payload : (payload.data || payload.students || payload.students_list || []);
  return (list || []).map(normalizeStudent);
};

export const fetchStudentByIdApi = async (id) => {
  const res = await fetch(`${BASE}/student/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    let body = '<no body>';
    try { body = await res.text(); } catch (e) { }
    throw new Error(`Fetch student failed: ${res.status} ${body}`);
  }

  const payload = await res.json();
  const obj = payload.data || payload || {};
  return normalizeStudent(obj);
};

export const searchStudentsApi = async ({ searchId, filterName, filterDepartment }) => {
  const q = new URLSearchParams();
  if (searchId) q.set('query', searchId);
  if (filterName) q.set('name', filterName);
  if (filterDepartment) q.set('department', filterDepartment);

  const res = await fetch(`${BASE}/student?${q.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('No students found');

  const payload = await res.json();
  const list = Array.isArray(payload) ? payload : (payload.data || payload.students || []);
  return list.map(normalizeStudent);
};

export const createStudentApi = async (studentData) => {
  const now = new Date();
  const [etYear, etMonth, etDay] = toEthiopian(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const etDate = `${etYear}-${String(etMonth).padStart(2, '0')}-${String(etDay).padStart(2, '0')}`;

  const payloadData = {
    student_id: studentData.id,
    first_name: studentData.firstname,
    last_name: studentData.lastname,
    phone_number: studentData.phone,
    department: studentData.department,
    email: studentData.email,
    current_batch_id: 5,
    is_certified: false,
    enrollment_date: etDate,
  };

  const res = await fetch(`${BASE}/student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadData),
    credentials: "include",
  });

  if (!res.ok) {
    let errBody = null;
    try { errBody = await res.text(); } catch (e) { errBody = '<unreadable body>'; }
    throw new Error(`Failed to add student: ${res.status} - ${errBody}`);
  }

  const result = await res.json();
  const created = result.createdStudent || result.data || result.student || result;
  return normalizeStudent(created);
};

export const updateStudentApi = async (id, studentData) => {
  const payload = {
    first_name: studentData.firstname,
    last_name: studentData.lastname,
    phone_number: studentData.phone,
    department: studentData.department,
    email: studentData.email,
  };

  const res = await fetch(`${BASE}/student/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    let body = '<no body>';
    try { body = await res.text(); } catch (e) { }
    throw new Error(`Failed to update student: ${res.status} ${body}`);
  }
};

export const deleteStudentApi = async (id) => {
  const res = await fetch(`${BASE}/student/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    let body = '<no body>';
    try { body = await res.text(); } catch (e) { }
    throw new Error(`Failed to delete student: ${res.status} ${body}`);
  }
};
