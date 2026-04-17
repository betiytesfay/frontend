import { useState } from 'react';

export default function SessionFilter({
  sessions,
  allBatches,
  selectedBatch,
  setSelectedBatch,
  selectedCourse,
  setSelectedCourse,
  selectedDepartment,
  setSelectedDepartment
}) {
  const [open, setOpen] = useState(false);

  const courses = Array.from(new Set(sessions.map(s => s.courseName))).filter(Boolean);
  const departments = Array.from(
    new Set(sessions.flatMap(s => s.students.map(st => st.department)))
  ).filter(Boolean).sort();

  const activeCount = [selectedBatch, selectedCourse, selectedDepartment].filter(Boolean).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium"
      >
        {/* 3-line filter icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="6" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Filter
        {activeCount > 0 && (
          <span className="bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-10 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex flex-col gap-3 min-w-[220px]">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Batch</label>
            <select
              value={selectedBatch || ''}
              onChange={e => setSelectedBatch(e.target.value || null)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <option value="">All Batches</option>
              {allBatches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Course</label>
            <select
              value={selectedCourse || ''}
              onChange={e => setSelectedCourse(e.target.value || null)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <option value="">All Courses</option>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Department</label>
            <select
              value={selectedDepartment || ''}
              onChange={e => setSelectedDepartment(e.target.value || null)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex justify-between items-center pt-1">
            {activeCount > 0 && (
              <button
                onClick={() => { setSelectedBatch(null); setSelectedCourse(null); setSelectedDepartment(null); }}
                className="text-xs text-red-500 hover:underline"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-xs bg-yellow-400 text-black px-3 py-1 rounded font-medium hover:bg-yellow-500"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
