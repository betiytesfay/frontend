import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from '../component/LoadingScreen';
import ReusablePieChart from '../component/PieChartComponent';
import AttendanceFilter from '../component/AttendanceFilter';

const BASE_URL = "https://gibi-backend-669108940571.us-central1.run.app";

export default function LastSessionAnalysisPage() {
  const navigate = useNavigate();
  const [rawData, setRawData] = useState(null); // { latestCourseDate, students, attendanceRecords, batchesData }
  const [allBatches, setAllBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPresent, setFilterPresent] = useState(false);
  const [filterAbsent, setFilterAbsent] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showStudentList, setShowStudentList] = useState(false);

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

        const sorted = [...courseDates].sort((a, b) => b.date_id - a.date_id);
        const latest = sorted[0];
        if (!latest) { setLoading(false); return; }

        setRawData({ latest, students, attendanceRecords, batchesData });
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoize session — only recomputes when raw data changes (not on filter changes)
  const session = useMemo(() => {
    if (!rawData) return null;
    const { latest, students, attendanceRecords, batchesData } = rawData;

    const attendanceMap = {};
    attendanceRecords.forEach(r => {
      if (r.date_id === latest.date_id) attendanceMap[r.student_id] = r.is_present;
    });

    // Only include students who have attendance records for this session
    const sessionStudentIds = Object.keys(attendanceMap);
    const studentsWithAttendance = students
      .filter(s => sessionStudentIds.includes(s.student_id))
      .map(s => ({
        student_id: s.student_id,
        name: `${s.first_name} ${s.last_name}`,
        is_present: attendanceMap[s.student_id] === true,
        gender: s.gender || 'N/A',
        department: s.department || 'N/A'
      }));

    // Also include attendance records whose student may not be in students list
    attendanceRecords
      .filter(r => r.date_id === latest.date_id && r.student)
      .forEach(r => {
        if (!studentsWithAttendance.find(s => s.student_id === r.student.student_id)) {
          studentsWithAttendance.push({
            student_id: r.student.student_id,
            name: `${r.student.first_name} ${r.student.last_name}`,
            is_present: r.is_present,
            gender: r.student.gender || 'N/A',
            department: r.student.department || 'N/A'
          });
        }
      });

    const present = studentsWithAttendance.filter(s => s.is_present).length;
    const absent = studentsWithAttendance.length - present;
    const total = studentsWithAttendance.length;
    const batchObj = batchesData.find(b => b.batch_id === latest.batch_id);

    return {
      id: latest.date_id,
      date: latest.class_date,
      courseName: latest.course?.course_name || 'N/A',
      batchName: batchObj?.batch_name || 'N/A',
      students: studentsWithAttendance,
      stats: {
        total, present, absent,
        presentPercentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
        absentPercentage: total > 0 ? ((absent / total) * 100).toFixed(1) : 0
      }
    };
  }, [rawData]);

  // Pie slices — department split (same as SessionCard)
  const getDeptSlices = (students) => {
    const departments = Array.from(new Set(students.map(s => s.department))).filter(Boolean).sort();
    return departments.flatMap(dept => {
      const inDept = students.filter(s => s.department === dept);
      const present = inDept.filter(s => s.is_present).length;
      const absent = inDept.length - present;
      return [
        { name: `${dept} Present`, value: present },
        { name: `${dept} Absent`, value: absent },
      ];
    });
  };

  const pieData = useMemo(() => {
    if (!session) return null;
    const deptStudents = selectedDepartment
      ? session.students.filter(s => s.department === selectedDepartment)
      : session.students;

    const pieSlices = selectedDepartment ? undefined : getDeptSlices(session.students);
    const piePresent = deptStudents.filter(s => s.is_present).length;
    const pieAbsent = deptStudents.length - piePresent;
    const pieTotal = deptStudents.length;

    return {
      slices: pieSlices,
      present: piePresent,
      absent: pieAbsent,
      presentPct: pieTotal > 0 ? ((piePresent / pieTotal) * 100).toFixed(1) : 0,
      absentPct: pieTotal > 0 ? ((pieAbsent / pieTotal) * 100).toFixed(1) : 0,
    };
  }, [session, selectedDepartment]);

  const filteredStudents = useMemo(() => {
    if (!session) return [];
    let filtered = session.students;
    if (selectedDepartment) filtered = filtered.filter(s => s.department === selectedDepartment);
    if (filterPresent && !filterAbsent) return filtered.filter(s => s.is_present);
    if (filterAbsent && !filterPresent) return filtered.filter(s => !s.is_present);
    return filtered;
  }, [session, selectedDepartment, filterPresent, filterAbsent]);

  if (loading) return <LoadingScreen message="Loading last session..." />;
  if (!session) return <p className="text-gray-900 p-6">No session data available.</p>;

  const { stats } = session;

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 md:p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Last Session Analysis</h1>

      <div className="bg-gray-100 border border-yellow-400 ml-2 rounded-lg p-4">
        <h2 className="font-bold text-lg mb-2">
          {session.date} - {session.courseName} ({session.batchName})
        </h2>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-white p-2 rounded shadow">
            <div className="text-xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500">Total Students</div>
          </div>
          <div className="bg-green-100 p-2 rounded shadow">
            <div className="text-xl font-bold text-green-600">{stats.present}</div>
            <div className="text-xs text-green-600">{stats.presentPercentage}%</div>
          </div>
          <div className="bg-red-100 p-2 rounded shadow">
            <div className="text-xl font-bold text-red-600">{stats.absent}</div>
            <div className="text-xs text-red-600">{stats.absentPercentage}%</div>
          </div>
        </div>

        <ReusablePieChart
          present={pieData.present}
          absent={pieData.absent}
          presentPercentage={pieData.presentPct}
          absentPercentage={pieData.absentPct}
          slices={pieData.slices}
          onClick={() => setShowStudentList(prev => !prev)}
        />

        {session.students.length > 0 && (
          <AttendanceFilter
            presentCount={stats.present}
            absentCount={stats.absent}
            filterPresent={filterPresent}
            filterAbsent={filterAbsent}
            setFilterPresent={setFilterPresent}
            setFilterAbsent={setFilterAbsent}
            allBatches={allBatches}
            sessions={[session]}
            selectedBatch={null}
            setSelectedBatch={() => { }}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
          />
        )}

        {showStudentList && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-yellow-400">
              Student Attendance {filteredStudents.length !== session.students.length &&
                `(Filtered: ${filteredStudents.length} of ${session.students.length})`}
            </h3>
            {filteredStudents.length > 0 ? (
              <div className="max-h-60 overflow-y-auto bg-white rounded shadow-inner p-2">
                {filteredStudents.map(s => (
                  <div key={s.student_id} className="border-b border-gray-200 py-2 text-sm flex justify-between">
                    <span className="text-gray-700">{s.name} ({s.student_id})</span>
                    <span className={s.is_present ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {s.is_present ? 'Present' : 'Absent'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-2 bg-gray-50 rounded">No students to display</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
