import React from "react";
import { BackButton } from "../backButton";
import { verifySessionAdminPassword } from "../../services/authServices";

export const AttendanceMarkModal = ({
  showAttendanceBox,
  setShowAttendanceBox,
  studentData,
  studentId, setStudentId,
  handleFetchStudent,
  handleMarkPresent,
  handleDoneWithPassword,
}) => {
  if (!showAttendanceBox) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4 relative w-[400px] max-w-[95%] h-[330px]">
        <BackButton
          onClick={async () => {
            const pwd = prompt("Enter session admin password to go back:");
            if (!pwd) return;
            const valid = await verifySessionAdminPassword(pwd);
            if (valid) setShowAttendanceBox(false);
            else alert("Incorrect password!");
          }}
          label="← "
        />

        {!studentData ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800">Mark Attendance</h2>
            <label className="text-sm text-gray-600">Enter Student ID (number only):</label>
            <input
              type="text"
              placeholder="1326-16"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetchStudent()}
              className="border p-2 rounded w-full"
            />
            <div className="flex gap-4 mt-2">
              <button
                onClick={handleFetchStudent}
                className="bg-[#D4AF35] text-white py-2 px-4 rounded hover:bg-[#d6aa19] transition flex-1 font-medium"
              >
                Next
              </button>
              <button
                onClick={handleDoneWithPassword}
                className="bg-[#D4AF35] text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition flex-1 font-medium"
              >
                Done
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-gray-800">
              Student Name: {studentData.fullName}
            </p>
            <p className="text-gray-600">ID: {studentData.student_id}</p>
            <button
              onClick={handleMarkPresent}
              className="bg-[#D4AF35] text-white py-2 px-4 mt-2 rounded-lg hover:bg-[#d6aa19] transition font-medium"
            >
              Mark as Present
            </button>
          </>
        )}
      </div>
    </div>
  );
};
