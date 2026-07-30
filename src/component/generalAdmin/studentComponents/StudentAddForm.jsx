import React from "react";

export const StudentAddForm = ({
  studentFirstName, setStudentFirstName,
  studentLastName, setStudentLastName,
  studentId, setStudentId,
  studentPhone, setStudentPhone,
  studentEmail, setStudentEmail,
  studentDepartment, setStudentDepartment,
  studentGender, setStudentGender,
  setShowAddPopup,
}) => {
  return (
    <>
      <h2 className="font-semibold mb-4 text-xl">Add Student</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">First Name:</label>
          <input
            type="text"
            placeholder="First Name"
            value={studentFirstName}
            onChange={(e) => setStudentFirstName(e.target.value)}
            className="border rounded h-10 px-2 w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Last Name:</label>
          <input
            type="text"
            placeholder="Last Name"
            value={studentLastName}
            onChange={(e) => setStudentLastName(e.target.value)}
            className="border rounded h-10 px-2 w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">ID:</label>
          <input
            type="text"
            placeholder="UGR-1234-16"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border rounded h-10 px-2 w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Phone:</label>
          <input
            type="tel"
            placeholder="+251987654321"
            value={studentPhone}
            onChange={(e) => setStudentPhone(e.target.value)}
            className="border rounded h-10 px-2 w-full"
            maxLength={13}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email:</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            className="border rounded h-10 px-2 w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Department</label>
          <select
            className="border rounded h-10 px-2 w-full max-w-xs"
            value={studentDepartment}
            onChange={(e) => setStudentDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            <option value="Accounting">Accounting</option>
            <option value="law">law</option>
            <option value="sociology">sociology</option>
            <option value="Economics">Economics</option>
            <option value="Management">Management</option>
            <option value="other">other</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Gender:</label>
          <select
            value={studentGender}
            onChange={(e) => setStudentGender(e.target.value)}
            className="border rounded h-10 px-2 w-full"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowAddPopup(true)}
          className="bg-[#D7B450] text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
        >
          + Add Student
        </button>
      </div>
    </>
  );
};
