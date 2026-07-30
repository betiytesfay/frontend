import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  GraduationCap, BookOpen, Layers, ShieldCheck, ChevronRight, TrendingUp, ArrowLeft,
} from 'lucide-react';

import AdminSidebar from '../component/generalAdmin/AdminSidebar.jsx';
import ManageStudents from '../component/generalAdmin/manageStudent.jsx';
import ManageCourses from '../component/generalAdmin/ManageCourses.jsx';
import ManageUser from '../component/generalAdmin/manageUser.jsx';
import ManageBatchs from '../component/generalAdmin/ManageBatchs.jsx';

const attendanceTrend = [
  { day: 'Mon', rate: 88 },
  { day: 'Tue', rate: 91 },
  { day: 'Wed', rate: 84 },
  { day: 'Thu', rate: 93 },
  { day: 'Fri', rate: 79 },
  { day: 'Sat', rate: 95 },
  { day: 'Sun', rate: 90 },
];

const stats = [
  { label: 'Students', value: '482', icon: GraduationCap },
  { label: 'Courses', value: '16', icon: BookOpen },
  { label: 'Batches', value: '6', icon: Layers },
  { label: 'Session admins', value: '9', icon: ShieldCheck },
];

const manage = [
  { key: 'students', label: 'Students', icon: GraduationCap },
  { key: 'courses', label: 'Courses', icon: BookOpen },
  { key: 'batches', label: 'Batches', icon: Layers },
  { key: 'admins', label: 'Session admins', icon: ShieldCheck },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <div className="min-h-screen w-full bg-[#F7F4EC] text-[#2A2620] font-sans lg:flex">

      <AdminSidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      {/* Main content */}
      <div className="flex-1 mx-auto max-w-5xl w-full px-4 py-5 sm:px-6 sm:py-8 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="flex items-center gap-1.5 text-xs font-medium text-[#8A8374] hover:text-[#2A2620] transition mb-1 lg:hidden"
              >
                <ArrowLeft size={13} />
                Back to dashboard
              </button>
            )}
            <h1 className="text-xl sm:text-2xl font-semibold mt-0.5 text-[#1F3A5F]">
              {selectedCategory
                ? manage.find((m) => m.key === selectedCategory)?.label
                : 'Welcome back, General Admin'}
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#D7B450] text-[#2A2620] flex items-center justify-center font-bold text-sm shrink-0 lg:hidden">
            GA
          </div>
        </div>

        {selectedCategory === 'students' && <ManageStudents setSelectedCategory={setSelectedCategory} />}
        {selectedCategory === 'courses' && <ManageCourses setSelectedCategory={setSelectedCategory} />}
        {selectedCategory === 'admins' && <ManageUser setSelectedCategory={setSelectedCategory} />}
        {selectedCategory === 'batches' && <ManageBatchs setSelectedCategory={setSelectedCategory} />}

        {/* Dashboard view — only shown when nothing is selected */}
        {!selectedCategory && (
          <>
            {/* Stat grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-white border border-black/[0.06] rounded-xl p-4 flex flex-col gap-3 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#D7B450]/25 flex items-center justify-center">
                    <Icon size={16} className="text-[#1F3A5F]" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold leading-none text-[#1F3A5F]">{value}</p>
                    <p className="text-xs text-[#8A8374] mt-1.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-black/[0.06] rounded-xl p-4 sm:p-5 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold">Attendance rate</h2>
                  <p className="text-xs text-[#8A8374]">Last 7 days, all batches</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#4C7A46] bg-[#4C7A46]/10 px-2.5 py-1 rounded-full">
                  <TrendingUp size={13} />
                  +4% vs last week
                </div>
              </div>
              <div className="h-44 sm:h-56 -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceTrend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#00000010" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: '#8A8374', fontSize: 11 }}
                      axisLine={{ stroke: '#00000014' }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[60, 100]}
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
                      stroke="#1F3A5F"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#1F3A5F', strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Manage — mobile/tablet only, sidebar covers this on desktop */}
            <div className="lg:hidden">
              <h2 className="text-sm font-semibold mb-3 text-[#8A8374] uppercase tracking-wide">Manage</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {manage.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className="flex flex-col items-start gap-3 rounded-xl p-4 border text-left transition active:scale-[0.98] bg-white border-black/[0.06] hover:border-black/[0.12] text-[#2A2620] shadow-sm"
                  >
                    <Icon size={18} className="text-[#B08B2E]" />
                    <span className="text-sm font-medium flex items-center gap-1">
                      {label}
                      <ChevronRight size={14} className="opacity-50" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}