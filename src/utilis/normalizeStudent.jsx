export const normalizeStudent = (raw = {}) => {
  return {
    id: raw.student_id ?? raw.id ?? "",
    firstname: raw.first_name ?? raw.firstname ?? "",
    lastname: raw.last_name ?? raw.lastname ?? "",
    email: raw.email ?? "",
    phone: raw.phone_number ?? raw.phone ?? "",
    department: raw.department ?? "",
    gender: raw.gender ?? "male",
  };
};