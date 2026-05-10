import axios from "axios";
import { BASE_URL } from "../constants/config";

export async function verifySessionAdminPassword(enteredPassword) {
  const adminId = localStorage.getItem("adminId");
  if (!adminId) {
    alert("No admin logged in!");
    return false;
  }
  try {
    const res = await axios.post(
      `${BASE_URL}/auth/login`,
      { student_id: adminId, password: enteredPassword },
      { withCredentials: true }
    );
    return res.data?.data?.user?.role === "admin";
  } catch (err) {
    console.error("Password verification failed", err.response?.data || err);
    return false;
  }
}
