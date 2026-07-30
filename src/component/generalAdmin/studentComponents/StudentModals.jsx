import React from "react";

export const StudentModals = ({
  // Add modal
  showAddPopup,
  setShowAddPopup,
  handleAddStudent,
  studentFirstName,
  studentLastName,
  studentPhone,

  // Delete modal
  showDeletePopup,
  setShowDeletePopup,
  handleDeleteStudent,
  selectedStudent,

  // Edit modal
  showEditPopup,
  setShowEditPopup,
  handleSaveEditStudent,
  fetchStudents,
  setStudentFirstName,
  setStudentLastName,
  setStudentPhone,
  setStudentEmail,
  setStudentDepartment,
  setStudentGender,
  studentEmail,
  studentDepartment,
  studentGender,

  // View modal
  showViewPopup,
  setShowViewPopup,
}) => {
  return (
    <>
      {/* === ADD POPUP === */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Confirm Add</h2>
            <p>Are you sure you want to add:</p>
            <br />
            <p className="font-bold mt-2 ring-black">{studentFirstName} {studentLastName}</p>
            <p>Phone Number: {studentPhone}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowAddPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAddStudent();
                  setShowAddPopup(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === DELETE POPUP === */}
      {showDeletePopup && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="font-semibold text-lg mb-2">Confirm Delete</h2>
            <p>Are you sure you want to delete:</p>
            <p className="font-bold mt-2">
              {selectedStudent.firstname} {selectedStudent.lastname}
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteStudent(selectedStudent.id);
                  setShowDeletePopup(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === EDIT POPUP === */}
      {showEditPopup && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm overflow-hidden max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="font-semibold text-lg mb-4">Edit Student</h2>
            <div className="flex flex-col gap-3 max-w-full">
              <input
                type="text"
                value={studentFirstName}
                onChange={(e) => setStudentFirstName(e.target.value)}
                placeholder="First Name"
                className="border px-3 py-2 rounded w-full box-border"
              />
              <input
                type="text"
                value={studentLastName}
                onChange={(e) => setStudentLastName(e.target.value)}
                placeholder="Last Name"
                className="border px-3 py-2 rounded w-full box-border"
              />
              <input
                type="tel"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="Phone"
                className="border px-3 py-2 rounded w-full box-border"
              />
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="Email"
                className="border px-3 py-2 rounded w-full box-border"
              />
              <input
                type="text"
                value={studentDepartment}
                onChange={(e) => setStudentDepartment(e.target.value)}
                placeholder="Department"
                className="border px-3 py-2 rounded w-full box-border"
              />
              <select
                value={studentGender}
                onChange={(e) => setStudentGender(e.target.value)}
                className="border px-3 py-2 rounded max-w-xs box-border"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowEditPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleSaveEditStudent(selectedStudent.id);
                  await fetchStudents();
                  setShowEditPopup(false);
                }}
                className="px-4 py-2 bg-[#D7B450] text-white rounded hover:bg-yellow-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === VIEW POPUP === */}
      {showViewPopup && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="font-semibold text-lg mb-4">Student Info</h2>
            <p><strong>ID:</strong> {selectedStudent.id}</p>
            <p><strong>Name:</strong> {selectedStudent.firstname} {selectedStudent.lastname}</p>
            <p><strong>Department:</strong> {selectedStudent.department}</p>
            <p><strong>Phone:</strong> {selectedStudent.phone}</p>
            <p><strong>Gender:</strong> {selectedStudent.gender}</p>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            <button
              onClick={() => setShowViewPopup(false)}
              className="w-full px-4 py-2 bg-gray-300 rounded mt-4 hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
