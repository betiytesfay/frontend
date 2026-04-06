import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = "https://gibi-backend-669108940571.us-central1.run.app";

export default function CertificateEligibility() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/course`);
      setCourses(res.data.data.courses || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchEligibilityData = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      // Fetch course dates for the selected course
      const courseDatesRes = await axios.get(`${BASE_URL}/course_date`);
      const allCourseDates = courseDatesRes.data.data.courseDates || [];
      const courseDates = allCourseDates.filter(cd => cd.course_id === parseInt(selectedCourse));

      // Fetch all attendance records
      const attendanceRes = await axios.get(`${BASE_URL}/attendance`);
      const attendanceRecords = attendanceRes.data.data.attendanceRecords || [];

      // Fetch students
      const studentsRes = await axios.get(`${BASE_URL}/student`);
      const allStudents = studentsRes.data.data || [];

      const totalClasses = courseDates.length;

      // Calculate attendance for each student
      const studentAttendance = {};
      attendanceRecords.forEach(record => {
        if (!studentAttendance[record.student_id]) {
          studentAttendance[record.student_id] = { present: 0, phone: '' };
        }
        // Check if the attendance is for this course
        const cd = courseDates.find(cd => cd.date_id === record.date_id);
        if (cd && record.is_present) {
          studentAttendance[record.student_id].present++;
        }
      });

      // Add phone numbers and calculate eligibility
      const eligibilityList = allStudents.map(student => {
        const attendance = studentAttendance[student.student_id] || { present: 0 };
        const percentage = totalClasses > 0 ? ((attendance.present / totalClasses) * 100).toFixed(1) : 0;
        return {
          ...student,
          present: attendance.present,
          total: totalClasses,
          percentage: parseFloat(percentage),
          eligible: parseFloat(percentage) >= 50,
        };
      });

      setStudents(eligibilityList);
    } catch (err) {
      console.error('Error fetching eligibility data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibilityData();
  }, [selectedCourse]);

  const handleCall = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      alert('No phone number available');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Certificate Eligibility</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Course:</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Choose a course</option>
          {courses.map(course => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Student ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Attendance</th>
                <th className="px-4 py-2 text-left">Percentage</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.student_id} className="border-t">
                  <td className="px-4 py-2">{student.student_id}</td>
                  <td className="px-4 py-2">{student.first_name} {student.last_name}</td>
                  <td className="px-4 py-2">{student.present}/{student.total}</td>
                  <td className="px-4 py-2">{student.percentage}%</td>
                  <td className="px-4 py-2">
                    {student.eligible ? (
                      <span className="text-green-600 font-bold">Eligible</span>
                    ) : (
                      <span className="text-red-600">Not Eligible</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {!student.eligible && (
                      <button
                        onClick={() => handleCall(student.phone_number)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Call
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
