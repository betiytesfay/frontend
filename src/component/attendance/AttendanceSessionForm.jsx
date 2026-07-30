import React from "react";
import { DatePicker } from "et-calendar";
import { EthiopianDate } from "et-calendar/lib";

export const AttendanceSessionForm = ({
  batchId, setBatchId,
  courseId, setCourseId,
  ethDate, setEthDate,
  batches, courses,
  handleStartAttendance,
  loading,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-[#D4AF35]">Session Attendance Setup</h1>

      <div>
        <label className="block text-sm font-medium mb-1">Batch:</label>
        <select
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="border p-2 rounded w-full bg-white"
        >
          <option value="">Select Batch</option>
          {batches.map((b) => (
            <option key={b.batch_id || b.id} value={b.batch_id || b.id}>
              {b.batch_name || b.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Course:</label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="border p-2 rounded w-full bg-white"
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.course_id || c.id} value={c.course_id || c.id}>
              {c.course_name || c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date:</label>
        <div className="border rounded w-full max-w-xs p-1">
          <DatePicker
            selectedDate={new Date()}
            onDateChange={(date) => {
              const eth = EthiopianDate.toEth(date);
              const y = eth.Year;
              const m = String(eth.Month).padStart(2, '0');
              const d = String(eth.Day).padStart(2, '0');
              setEthDate(`${y}-${m}-${d}`);
            }}
            showCalendars="ethiopian"
            viewFirst="Ethiopian"
            closeOnSelect
          />
        </div>
        {ethDate && <p className="text-sm text-gray-500 mt-1">Selected: {ethDate}</p>}
      </div>

      <button
        onClick={handleStartAttendance}
        disabled={loading}
        className="bg-[#D4AF35] text-black py-2 px-4 rounded hover:bg-[#d6aa19] transition w-full font-semibold disabled:opacity-50 mt-2"
      >
        {loading ? "Creating Session..." : "Start Attendance"}
      </button>
    </div>
  );
};
