import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from '../component/LoadingScreen';

const BASE_URL = "https://gibi-backend-669108940571.us-central1.run.app";
const PAGE_SIZE = 10;

export default function CertificateStatusPage() {
  const navigate = useNavigate();
  const [studentStats, setStudentStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          axios.get(`${BASE_URL}/student`),
          axios.get(`${BASE_URL}/attendance`)
        ]);

        const students = studentsRes.data?.data || [];
        const records = attendanceRes.data?.data?.attendanceRecords || [];
        const totalClasses = new Set(records.map(r => r.date_id)).size;

        const presentMap = {};
        records.forEach(r => {
          if (r.is_present) presentMap[r.student_id] = (presentMap[r.student_id] || 0) + 1;
        });

        const stats = students.map(s => {
          const present = presentMap[s.student_id] || 0;
          const percentage = totalClasses > 0 ? (present / totalClasses) * 100 : 0;
          return {
            id: s.student_id,
            name: `${s.first_name} ${s.last_name}`,
            department: s.department,
            phone: s.phone_number,
            present,
            total: totalClasses,
            percentage
          };
        });

        setStudentStats(stats);
      } catch (err) {
        console.error("Error fetching certificate data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(studentStats.length / PAGE_SIZE);
  const paginated = studentStats.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCall = (student) => {
    if (window.confirm(`Call ${student.name} at ${student.phone}?`)) {
      window.location.href = `tel:${student.phone}`;
    }
  };

  if (loading) return <LoadingScreen message="Loading certificate data..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition"
        >
          ← Back
        </button>
        <div className="h-5 w-px bg-gray-300" />
        <h1 className="text-xl font-bold text-gray-800">Certificate Status</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Student cards */}
        <div className="space-y-3">
          {paginated.map(student => {
            const eligible = student.percentage >= 50;
            return (
              <div
                key={student.id}
                className={`bg-white rounded-xl shadow-sm border-l-4 p-4 ${eligible ? 'border-green-400' : 'border-red-400'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-gray-800">{student.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{student.id} · {student.department}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${eligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {eligible ? '✓ Eligible' : '✗ Not Eligible'}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>{student.present} / {student.total} classes attended</span>
                  <span className={`font-semibold ${eligible ? 'text-green-600' : 'text-red-500'}`}>
                    {student.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${eligible ? 'bg-green-400' : 'bg-red-400'}`}
                    style={{ width: `${Math.min(student.percentage, 100)}%` }}
                  />
                </div>

                {!eligible && (
                  <div className="mt-3 flex items-center justify-between bg-red-50 rounded-lg px-3 py-2">
                    <span className="text-xs text-gray-500">
                      📞 {student.phone || 'No phone number'}
                    </span>
                    {student.phone && (
                      <button
                        onClick={() => handleCall(student)}
                        className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium transition"
                      >
                        Call
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {studentStats.length === 0 && (
            <div className="text-center py-16 text-gray-400">No students found.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg shadow-sm disabled:opacity-40 hover:bg-gray-50 transition"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-500">
              {page} <span className="text-gray-300">/</span> {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg shadow-sm disabled:opacity-40 hover:bg-gray-50 transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
