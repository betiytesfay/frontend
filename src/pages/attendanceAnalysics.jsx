import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SessionFilter from '../component/SessionFilter';
import SessionCard from '../component/SessionCard';
import { CertificateButton } from '../component/CertificateButton';

const BASE_URL = "https://gibi-backend-669108940571.us-central1.run.app";

export default function AttendanceAnalysisPage() {
  const navigate = useNavigate();
  const [backendSessions, setBackendSessions] = useState([]);
  const [allBatches, setAllBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const verifySessionAdminPassword = async (enteredPassword) => {
    const adminId = localStorage.getItem('adminId');
    if (!adminId) { alert('No admin logged in!'); return false; }
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/login`,
        { student_id: adminId, password: enteredPassword },
        { withCredentials: true }
      );
      return res.data?.data?.user?.role === 'admin';
    } catch (err) {
      console.error('Password verification failed', err.response?.data || err);
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseDatesRes, attendanceRes, studentsRes, batchesRes] = await Promise.all([
          axios.get(`${BASE_URL}/course_date`),
          axios.get(`${BASE_URL}/attendance`),
          axios.get(`${BASE_URL}/student`),
          axios.get(`${BASE_URL}/batches`)
        ]);

        const courseDates = courseDatesRes.data?.data?.courseDates || [];
        const students = studentsRes.data?.data || [];
        const attendanceRecords = attendanceRes.data?.data?.attendanceRecords || [];
        const batchesData = batchesRes.data?.data?.batches || [];

        setAllBatches(batchesData.map(b => b.batch_name).filter(Boolean));

        const attendanceByDate = {};
        attendanceRecords.forEach(record => {
          if (!attendanceByDate[record.date_id]) attendanceByDate[record.date_id] = {};
          attendanceByDate[record.date_id][record.student_id] = record.is_present;
        });

        const sessionsWithStats = courseDates.map(cd => {
          const batchObj = batchesData.find(b => b.batch_id === cd.batch_id);
          const attendanceMap = attendanceByDate[cd.date_id] || {};

          const studentsWithAttendance = students.map(student => ({
            student_id: student.student_id,
            name: `${student.first_name} ${student.last_name}`,
            is_present: attendanceMap[student.student_id] === true,
            gender: student.gender || 'N/A',
            department: student.department || 'N/A'
          }));

          const present = studentsWithAttendance.filter(s => s.is_present).length;
          const absent = studentsWithAttendance.length - present;
          const total = studentsWithAttendance.length;

          return {
            id: cd.date_id,
            date: cd.class_date,
            courseName: cd.course?.course_name || 'N/A',
            batchId: cd.batch_id,
            batchName: batchObj?.batch_name || 'N/A',
            students: studentsWithAttendance,
            stats: {
              total, present, absent,
              presentPercentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
              absentPercentage: total > 0 ? ((absent / total) * 100).toFixed(1) : 0
            }
          };
        });

        setBackendSessions(sessionsWithStats);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSessions = backendSessions.filter(session => {
    const batchMatches = !selectedBatch || session.batchName === selectedBatch;
    const courseMatches = !selectedCourse || session.courseName === selectedCourse;
    const deptMatches = !selectedDepartment || session.students.some(s => s.department === selectedDepartment);
    return batchMatches && courseMatches && deptMatches;
  });

  const totalPages = Math.ceil(filteredSessions.length / pageSize);
  const paginatedSessions = filteredSessions.slice((page - 1) * pageSize, page * pageSize);

  const handleBack = async () => {
    const enteredPassword = prompt('Enter session admin password to go back:');
    if (!enteredPassword) return;
    const isValid = await verifySessionAdminPassword(enteredPassword);
    if (isValid) navigate(-1);
    else alert('Incorrect password!');
  };

  if (loading) return <p className="text-gray-900 p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 md:p-8">
      <div className="flex gap-4 justify-between items-center mb-4">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-[#D4AF35] text-black rounded hover:bg-yellow-500"
        >
          ← Back
        </button>
        <CertificateButton />
      </div>

      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Attendance Analysis</h1>

      <div className="flex items-center gap-3 mb-6">
        <SessionFilter
          sessions={backendSessions}
          allBatches={allBatches}
          selectedBatch={selectedBatch}
          setSelectedBatch={(v) => { setSelectedBatch(v); setPage(1); }}
          selectedCourse={selectedCourse}
          setSelectedCourse={(v) => { setSelectedCourse(v); setPage(1); }}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={(v) => { setSelectedDepartment(v); setPage(1); }}
        />
        <select
          value={pageSize}
          onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
        >
          {[10, 20, 25, 50, 100].map(n => (
            <option key={n} value={n}>{n} per page</option>
          ))}
        </select>
      </div>

      {backendSessions.length === 0 ? (
        <p className="text-gray-500">No attendance data available.</p>
      ) : (
        <>
          {paginatedSessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              allBatches={allBatches}
              isExpanded={expandedSessionId === session.id}
              onToggle={() => setExpandedSessionId(expandedSessionId === session.id ? null : session.id)}
            />
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg shadow-sm disabled:opacity-40 hover:bg-gray-50 transition"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-500">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg shadow-sm disabled:opacity-40 hover:bg-gray-50 transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
