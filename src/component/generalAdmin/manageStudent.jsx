import React, { useState } from "react";
import { FaUserPlus, FaUserEdit, FaUserMinus, FaUserCircle } from "react-icons/fa";

const ManageStudents = () => {
  // === Students State ===
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  const [studentPhone, setStudentPhone] = useState("");
  const [studentGender, setStudentGender] = useState("male");
  const [searchId, setSearchId] = useState("");

  const [showFilter, setShowFilter] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");


  const [students, setStudents] = useState([]);
  const [studentDepartment, setStudentDepartment] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);

  // === Popups ===
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const openDeleteConfirm = (student) => {
    setSelectedStudent(student);
    setShowDeletePopup(true);
  };

  const openEditForm = (student) => {
    setSelectedStudent(student);

    // preload fields
    setStudentFirstName(student.firstname);
    setStudentLastName(student.lastname);
    setStudentPhone(student.phone);
    setStudentGender(student.gender);
    setStudentDepartment(student.department);
    setStudentEmail(student.email);

    setShowEditPopup(true);
  };

  const openViewPopup = (student) => {
    setSelectedStudent(student);
    setShowViewPopup(true);
  };



  // === Action state ===
  const [selectedAction, setSelectedAction] = useState(""); // "add", "edit", "delete"
  // load all students from backend
  const fetchStudents = async () => {
    try {
      const res = await fetch("https://attendance-production-d583.up.railway.app/student", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        console.log("Failed to fetch students");
        return;
      }

      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.log("Backend error:", err);
    }
  };
  React.useEffect(() => {
    fetchStudents();
  }, []);
  const fetchStudentById = async () => {
    const res = await fetch(
      `https://attendance-production-d583.up.railway.app/student/${searchId}`
    );
    const data = await res.json();
    setStudents([data]);
  };
  React.useEffect(() => {
    if (selectedAction === "view") {
      fetchStudents();
    }
  }, [selectedAction]);



  const applyFilter = async () => {
    const res = await fetch(
      `https://attendance-production-d583.up.railway.app/student?name=${filterName}&department=${filterDepartment}`
    );
    const data = await res.json();
    setStudents(data);
  };



  // === Handlers ===
  const handleAddStudent = async () => {
    if (!studentFirstName || !studentLastName || !studentDepartment || !studentEmail || !studentPhone || !studentGender) {
      return alert("Please fill out all student info.");
    }

    const newStudent = {
      firstname: studentFirstName,
      lastname: studentLastName,
      phone: studentPhone,
      gender: studentGender,
      department: studentDepartment,
      email: studentEmail
    };

    try {
      const res = await fetch("https://attendance-production-d583.up.railway.app/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      if (!res.ok) {
        return alert("Failed to add student");
      }

      const saved = await res.json(); // backend response
      setStudents([...students, saved]); // add to local table
    } catch (error) {
      console.log("Error:", error);
      alert("Cannot connect to backend");
    }

    // reset fields
    setStudentFirstName("");
    setStudentLastName("");
    setStudentPhone("");
    setStudentGender("male");
    setStudentDepartment("");
    setStudentEmail("");
  };



  const handleSaveEditStudent = async (id) => {

    const updateStudent = {
      firstname: studentFirstName,
      lastname: studentLastName,
      phone: studentPhone,
      gender: studentGender,
      department: studentDepartment,
      email: studentEmail
    };

    try {
      const res = await fetch(`https://attendance-production-d583.up.railway.app/student/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateStudent),
      });

      if (!res.ok) return alert("Failed to update student");

      const updated = await res.json();

      // refresh list
      fetchStudents();

      // Clear form
      setStudentFirstName("");
      setStudentLastName("");
      setStudentPhone("");
      setStudentGender("male");
      setStudentDepartment("");
      setStudentEmail("");

      alert("Student updated successfully!");

    } catch (err) {
      console.log(err);
      alert("Could not connect to backend");
    }
  };


  const handleDeleteStudent = async (id) => {
    try {
      const res = await fetch(`https://attendance-production-d583.up.railway.app/student/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) return alert("Failed to delete student");

      setStudents(students.filter((s) => s.id !== id));

    } catch (err) {
      console.log(err);
      alert("Could not connect to backend");
    }
  };


  return (
    <div className="bg-white p-6 rounded-lg  max-w-5xl mx-auto">
      {/* Step 2: Select Action */}
      {!selectedAction && (
        <div className="flex flex-col justify-center gap-4 h-[40vh] max-w-sm bg-white/50 p-4 rounded-xl shadow-md w-full mx-auto">
          <h2 className="text-xl font-semibold text-center">Select One</h2>
          <button
            onClick={() => setSelectedAction("add")}
            className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition"
          >
            <FaUserPlus className="w-5 h-5" /> Add Student
          </button>
          <button
            onClick={() => setSelectedAction("edit")}
            className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition"
          >
            <FaUserEdit className="w-5 h-5" /> Edit Student
          </button>
          <button
            onClick={() => setSelectedAction("delete")}
            className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition"
          >
            <FaUserMinus className="w-5 h-5" /> Delete Student
          </button>

          <button
            className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition"
            onClick={() => setSelectedAction("view")}

          >
            <FaUserCircle className="w-5 h-5" /> View Student
          </button>

        </div>
      )}

      {/* Add Student Form */}
      {selectedAction === "add" && (
        <div className="bg-white/90 p-6 rounded-lg shadow-md max-w-5xl mx-auto">
          <h2 className="font-semibold mb-4 text-xl">Add Student</h2>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">First Name:</label>
              <input
                type="text"
                placeholder="First Name"
                value={studentFirstName}
                onChange={(e) => setStudentFirstName(e.target.value)}
                className="border rounded h-9 px-2 flex-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Last Name:</label>
              <input
                type="text"
                placeholder="Last Name"
                value={studentLastName}
                onChange={(e) => setStudentLastName(e.target.value)}
                className="border rounded h-9 px-2 flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Phone:</label>
              <input
                type="text"
                placeholder="Phone Number"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                className="border rounded h-9 px-2 flex-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Email:</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="border rounded h-9 px-2 flex-1"
              />
            </div>


            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Department:</label>
              <input
                type="text"
                placeholder="Accounting"
                value={studentDepartment}
                onChange={(e) => setStudentDepartment(e.target.value)}
                className="border rounded h-9 px-2 flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Gender:</label>
              <select
                value={studentGender}
                onChange={(e) => setStudentGender(e.target.value)}
                className="border rounded h-9 px-2 min-w-[200px] flex-1"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setShowAddPopup(true)}

              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              + Add Student
            </button>
          </div>
        </div>
      )}

      {selectedAction === "edit" && (<div className="w-full p-4">

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by ID…"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            onClick={fetchStudentById}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Search
          </button>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Filter
          </button>
        </div>

        {/* Filter Overlay */}
        {showFilter && (
          <div className="mt-3 border p-3 rounded bg-white shadow">
            <input
              type="text"
              placeholder="Name…"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-2"
            />

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-2"
            >
              <option value="">Department</option>
              <option value="Accounting">Accounting</option>
              <option value="Computer Science">Computer Science</option>
            </select>

            <button
              onClick={applyFilter}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded"
            >
              Apply
            </button>
          </div>
        )}

        {/* Cards */}
        <div className="mt-4 space-y-4">
          {students.map((s) => (
            <div key={s.id} className="border rounded p-3 shadow bg-white">
              <div className="flex justify-between items-center">

                {/* Left: Checkbox + ID */}
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>ID: {s.id}</span>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2">
                  <button
                    className="text-blue-600"
                    onClick={() => openEditForm(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => openDeleteConfirm(s)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="mt-2 text-sm">
                <p>Name: {s.firstname} {s.lastname}</p>
                <p>Department: {s.department}</p>
                <p>Phone: {s.phone}</p>
                <p>Gender: {s.gender}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
      )}

      {selectedAction === "view" && students.length > 0 && (
        <div className="flex flex-col gap-4 mt-4">
          {students.map((s) => (
            <div
              key={s.id}
              className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
            >
              {/* Top row: Checkbox, ID, Actions */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="font-semibold">ID: {s.id}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openViewPopup(s)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() => openEditForm(s)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => openDeleteConfirm(s)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>
              </div>

              {/* Student details */}
              <div className="flex flex-col gap-1 mt-2">
                <span><strong>Name:</strong> {s.firstname} {s.lastname}</span>
                <span><strong>Department:</strong> {s.department}</span>
                <span><strong>Phone:</strong> {s.phone}</span>
                <span><strong>Gender:</strong> {s.gender}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {showDeletePopup && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="font-semibold text-lg mb-2">Confirm Delete</h2>
            <p>Are you sure you want to delete:</p>
            <p className="font-bold mt-2">
              {selectedStudent.firstname} {selectedStudent.lastname}
            </p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleDeleteStudent(selectedStudent.id);
                  setShowDeletePopup(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* === EDIT POPUP === */}
      {showEditPopup && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="font-semibold text-lg mb-4">Edit Student</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={studentFirstName}
                onChange={(e) => setStudentFirstName(e.target.value)}
                placeholder="First Name"
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                value={studentLastName}
                onChange={(e) => setStudentLastName(e.target.value)}
                placeholder="Last Name"
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="Phone"
                className="border px-3 py-2 rounded"
              />
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="Email"
                className="border px-3 py-2 rounded"
              />

              <input
                type="text"
                value={studentDepartment}
                onChange={(e) => setStudentDepartment(e.target.value)}
                placeholder="Department"
                className="border px-3 py-2 rounded"
              />
              <select
                value={studentGender}
                onChange={(e) => setStudentGender(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowEditPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleSaveEditStudent(selectedStudent.id);
                  await fetchStudents();         // <-- ⭐ ADD THIS LINE
                  setShowEditPopup(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={async () => {
                  await handleSaveEditStudent(selectedStudent.id);
                  await fetchStudents();
                  setShowEditPopup(false);
                }}
                className="px-4 py-2 bg-Yellow-600 text-white rounded"
              >
                Save
              </button>

            </div>
          </div>
        </div>
      )}

      {/* === VIEW POPUP === */}
      {showViewPopup && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
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
              className="w-full px-4 py-2 bg-gray-300 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">

            <h2 className="text-lg font-semibold mb-2">Confirm Add</h2>
            <p>Are you sure you want to add:</p>
            <p className="font-bold mt-2">{studentFirstName} {studentLastName}</p>
            <p>Email: {studentEmail}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowAddPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleAddStudent();
                  setShowAddPopup(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}



    </div>

  );
};

export default ManageStudents;
