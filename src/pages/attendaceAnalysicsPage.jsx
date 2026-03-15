import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BackButton } from "../component/backButton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BASE_URL = "https://gibi-backend-669108940571.us-central1.run.app";

export default function AttendanceAnalyticsPage() {
  const navigate = useNavigate();

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);

  // Fetch all attendance
  const fetchAttendanceRecords = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/attendance_records`);
      setAttendanceRecords(res.data.data.attendanceRecords || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/batches`);
      setBatches(res.data.data.batches || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/course`);
      setCourses(res.data.data.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Build chart data & metrics
  const buildChartData = () => {
    let filtered = attendanceRecords.filter((r) => {
      if (selectedBatch && r.course_date.batch_id !== Number(selectedBatch)) return false;
      if (selectedCourse && r.course_date.course_id !== Number(selectedCourse)) return false;
      return true;
    });

    // Group by class_date
    const grouped = {};
    filtered.forEach((r) => {
      const date = r.course_date.class_date.split("T")[0]; // yyyy-mm-dd
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(r);
    });

    const data = [];
    let prevCount = 0;
    for (const date of Object.keys(grouped).sort()) {
      const records = grouped[date];
      const presentCount = records.filter((r) => r.is_present).length;

      const percentChange = prevCount ? ((presentCount - prevCount) / prevCount) * 100 : 0;

      // Unique visitors: students whose batch doesn't match the class batch
      const uniqueVisitors = records.filter(
        (r) => r.student.current_batch_id !== r.course_date.batch_id
      ).length;

      data.push({
        date,
        studentsPresent: presentCount,
        percentChange: percentChange.toFixed(1),
        uniqueVisitors,
      });

      prevCount = presentCount;
    }

    setChartData(data);
  };

  useEffect(() => {
    fetchAttendanceRecords();
    fetchBatches();
    fetchCourses();
  }, []);

  useEffect(() => {
    buildChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceRecords, selectedBatch, selectedCourse]);

  const totalStudents = chartData.reduce((acc, d) => acc + d.studentsPresent, 0);
  const totalUniqueVisitors = chartData.reduce((acc, d) => acc + d.uniqueVisitors, 0);
  const lastPercentChange =
    chartData.length > 1 ? chartData[chartData.length - 1].percentChange : 0;

  return (
    <div className="p-6">
      <BackButton onClick={() => navigate("/sessionAdmin")} label="← " />
      <h1 className="text-3xl font-bold text-[#D4AF35] mb-4">Attendance Analytics</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Batches</option>
          {batches.map((b) => (
            <option key={b.batch_id} value={b.batch_id}>
              {b.batch_name}
            </option>
          ))}
        </select>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.course_id} value={c.course_id}>
              {c.course_name}
            </option>
          ))}
        </select>
      </div>

      {/* Metrics */}
      <div className="flex gap-6 flex-wrap mb-6">
        <div className="bg-white p-4 rounded shadow w-1/2">
          <p className="text-gray-600">Attended Students</p>
          <p className="text-2xl font-bold">{totalStudents}</p>
          <p className="text-green-600">{lastPercentChange}% from last session</p>
        </div>
        <div className="bg-white p-4 rounded shadow w-1/2">
          <p className="text-gray-600">Unique Visitors</p>
          <p className="text-2xl font-bold">{totalUniqueVisitors}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded shadow">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="studentsPresent"
              stroke="#D4AF35"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
