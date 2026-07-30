import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Users, CalendarDays, PlayCircle, History, Percent } from 'lucide-react';
import { BackButton } from '../component/backButton';
import axios from 'axios';

const baseURL = "https://gibi-backend-669108940571.us-central1.run.app";

export default function SessionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [totalStudent, setTotalStudent] = useState(null);
  const [lastSessionDate, setLastSessionDate] = useState(null);
  const [lastSessionPresent, setLastSessionPresent] = useState(null);
  const [sessionTrend, setSessionTrend] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [courseDatesRes, attendanceRes, studentsRes] = await Promise.all([
          axios.get(`${baseURL}/course_date`),
          axios.get(`${baseURL}/attendance`),
          axios.get(`${baseURL}/student`)
        ]);

        const students = studentsRes.data?.data || [];
        const courseDates = courseDatesRes.data?.data?.courseDates || [];
        const attendanceRecords = attendanceRes.data?.data?.attendanceRecords || [];

        const totalStudents = students.length;
        setTotalStudent(totalStudents);

        if (!courseDates.length) {
          setLastSessionDate('No sessions yet');
          setLastSessionPresent(0);
          return;
        }

        const sortedDates = [...courseDates].sort((a, b) => a.date_id - b.date_id);
        const latest = sortedDates[sortedDates.length - 1];

        const presentCount = attendanceRecords.filter(
          r => r.date_id === latest.date_id && r.is_present === true
        ).length;

        setLastSessionDate(latest.class_date);
        setLastSessionPresent(presentCount);

        const recentSessions = sortedDates.slice(-6);
        const trend = recentSessions.map((session) => {
          const present = attendanceRecords.filter(
            r => r.date_id === session.date_id && r.is_present === true
          ).length;
          const rate = totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 0;
          return { date: session.class_date, rate };
        });
        setSessionTrend(trend);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const lastRate = totalStudent > 0 && lastSessionPresent !== null
    ? Math.round((lastSessionPresent / totalStudent) * 100)
    : null;

  return (
    <div className="min-h-screen w-full bg-[#F7F4EC] text-[#2A2620] font-sans">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-8">

        <div className="flex justify-start mb-4">
          <BackButton to="/" label="← " />
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-6">
          Welcome, Session Admin
        </h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white border border-black/[0.06] rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Users size={20} className="text-blue-700" />
            </div>
            <div>
              <p className="text-xl font-semibold leading-none text-blue-700">
                {loading ? '—' : totalStudent}
              </p>
              <p className="text-xs text-[#8A8374] mt-1.5">Total students</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/last-session-analysis')}
            className="bg-white border border-black/[0.06] rounded-xl p-4 flex items-center gap-4 shadow-sm text-left hover:border-black/[0.12] transition"
          >
            <div className="w-11 h-11 rounded-lg bg-[#D7B450]/15 flex items-center justify-center shrink-0">
              <CalendarDays size={20} className="text-[#B08B2E]" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-blue-700">
                {loading ? '—' : lastSessionDate}
              </p>
              <p className="text-xs text-[#8A8374] mt-1.5">Last session</p>
            </div>
          </button>

          <div className="bg-white border border-black/[0.06] rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Percent size={20} className="text-blue-700" />
            </div>
            <div>
              <p className="text-xl font-semibold leading-none text-blue-700">
                {loading || lastRate === null ? '—' : `${lastRate}%`}
              </p>
              <p className="text-xs text-[#8A8374] mt-1.5">
                {loading ? 'Loading...' : `${lastSessionPresent} / ${totalStudent || 0} present`}
              </p>
            </div>
          </div>
        </div>

        {/* Attendance trend */}
        <div className="bg-white border border-black/[0.06] rounded-xl p-4 sm:p-5 mb-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Attendance rate</h2>
            <p className="text-xs text-[#8A8374]">Last {sessionTrend.length || '—'} sessions</p>
          </div>
          <div className="h-44 sm:h-56 -ml-2">
            {sessionTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sessionTrend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#00000010" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#8A8374', fontSize: 11 }}
                    axisLine={{ stroke: '#00000014' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#8A8374', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{ background: '#FFFFFF', border: '1px solid #00000014', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#8A8374' }}
                    formatter={(v) => [`${v}%`, 'Attendance']}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#1D4ED8"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#1D4ED8', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-[#8A8374]">
                {loading ? 'Loading sessions...' : 'No session history yet'}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/attendance')}
            className="flex-1 flex items-center justify-center gap-2 bg-[#D4AF35] text-white px-5 py-3 text-sm font-semibold rounded-lg border border-[#B08B2E] hover:bg-[#c39d28] transition"
          >
            <PlayCircle size={18} />
            Start attendance
          </button>
          <button
            onClick={() => navigate('/attendance-analysis')}
            className="flex-1 flex items-center justify-center gap-2 bg-[#D4AF35] text-white px-5 py-3 text-sm font-semibold rounded-lg border border-[#B08B2E] hover:bg-[#c39d28] transition"
          >
            <History size={18} />
            View history
          </button>
        </div>

      </div>
    </div>
  );
}