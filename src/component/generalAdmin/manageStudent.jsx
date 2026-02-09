import React, { useState } from "react";
import { FaUserPlus, FaUserEdit, FaUserMinus, FaUserCircle, FaSearch, FaFilter, FaEdit, FaTrash } from "react-icons/fa";
import { toEthiopian } from 'ethiopian-date';

const BASE = "https://gibi-backend-669108940571.us-central1.run.app";

// normalize/backend -> UI model
const normalizeStudent = (raw) => {
  if (!raw) return null;
  return {
    id: raw.student_id || raw.id || raw.student_id_value || String(raw.student_id || raw.id || ''),
    firstname: raw.first_name || raw.firstname || raw.firstName || raw.name || '',
    lastname: raw.last_name || raw.lastname || raw.lastName || '',
    email: raw.email || raw.email_address || '',
    phone: raw.phone_number || raw.phone || raw.phoneNumber || '',
    department: raw.department || raw.dept || '',
    gender: raw.gender || 'male',
    raw,
  };
};

const ManageStudents = () => {
  // === Students State ===
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentGender, setStudentGender] = useState("male");
  const [searchId, setSearchId] = useState("");
  const [page, setPage] = useState(1);
  const studentsPerPage = 6;
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
      const res = await fetch(`${BASE}/student`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Failed to fetch students: ${res.status}`);

      const payload = await res.json();
      const list = Array.isArray(payload) ? payload : (payload.data || payload.students || payload.students_list || []);
      const normalized = (list || []).map(normalizeStudent);
      setStudents(normalized);

    } catch (err) {
      console.log("Backend error:", err);
      alert("Cannot fetch students from backend. Please check the server.");
    }
  };


  React.useEffect(() => {
    fetchStudents();
  }, []);
  const fetchStudentById = async () => {
    try {
      const res = await fetch(`${BASE}/student/${encodeURIComponent(searchId)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) return alert("Student not found");

      const payload = await res.json();
      const obj = payload.data || payload || {};
      setStudents([normalizeStudent(obj)]);
    } catch (err) {
      console.error(err);
      alert("Cannot fetch student by id");
    }
  };
  React.useEffect(() => {
    if (selectedAction === "view") {
      fetchStudents();
    }
  }, [selectedAction]);



  const applyFilter = async () => {
    try {
      const q = new URLSearchParams();
      if (filterName) q.set('name', filterName);
      if (filterDepartment) q.set('department', filterDepartment);
      const res = await fetch(`${BASE}/student?${q.toString()}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      if (!res.ok) return alert('Filter request failed');
      const payload = await res.json();
      const list = Array.isArray(payload) ? payload : (payload.data || payload.students || []);
      setStudents((list || []).map(normalizeStudent));
    } catch (err) {
      console.error(err);
      alert('Cannot apply filter');
    }
  };

  // === Handlers ===
  const handleAddStudent = async () => {
    // debug: log current form state
    console.log('handleAddStudent values', {
      studentFirstName,
      studentLastName,
      studentDepartment,
      studentEmail,
      studentPhone,
      studentGender,
    });

    // trim strings and validate
    const f = (studentFirstName || "").trim();
    const l = (studentLastName || "").trim();
    const dept = (studentDepartment || "").toString().trim();
    const email = (studentEmail || "").trim();
    const phone = (studentPhone || "").toString().trim();
    const gender = (studentGender || "").toString().trim();

    if (!f || !l || !dept || !email || !phone || !gender) {
      console.warn('Validation failed — missing field', { f, l, dept, email, phone, gender });
      return alert("Please fill out all student info.");
    }

    // check duplicates (email and phone) against loaded students
    const studentList = Array.isArray(students) ? students : [];
    console.log('existing students count', studentList.length);
    const dupEmail = studentList.find(
      (s) => s && ((s.email && s.email === email) || (s.email_address && s.email_address === email)),
    );
    if (dupEmail) return alert('A student with this email already exists.');

    const dupPhone = studentList.find(
      (s) => s && ((s.phone && s.phone === phone) || (s.phone_number && s.phone_number === phone)),
    );
    if (dupPhone) return alert('A student with this phone number already exists.');

    const now = new Date();
    const [etYear, etMonth, etDay] = toEthiopian(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const etDate = `${etYear}-${String(etMonth).padStart(2, '0')}-${String(etDay).padStart(2, '0')}`;

    const newStudent = {
      student_id: `STU-${Date.now()}`,
      first_name: f,
      last_name: l,
      phone_number: phone,
      department: dept,
      email: email,
      current_batch_id: 5,
      is_certified: false,
      enrollment_date: etDate,
    };


    try {
      const res = await fetch(`${BASE}/student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
        credentials: "include",
      });

      if (!res.ok) {
        let errBody = null;
        try {
          errBody = await res.text();
        } catch (e) {
          errBody = '<unreadable response body>';
        }
        console.error('Add student failed', res.status, errBody);
        return alert(`Failed to add student: ${res.status} - ${errBody}`);
      }

      const result = await res.json();
      // try several common response shapes
      const created = result.createdStudent || result.data || result.student || result;
      setStudents(prev => [
        ...prev,
        normalizeStudent(created)
      ]);

    } catch (error) {
      console.log("Error:", error);
      alert("Cannot connect to backend");
    }

    setStudentFirstName("");
    setStudentLastName("");
    setStudentPhone("");
    setStudentGender("male");
    setStudentDepartment("");
    setStudentEmail("");
  };


  const handleSaveEditStudent = async (id) => {

    const updateStudent = {
      first_name: studentFirstName,
      last_name: studentLastName,
      phone_number: studentPhone,
      department: studentDepartment,
      email: studentEmail
    };

    try {
      const res = await fetch(`${BASE}/student/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateStudent),
        credentials: "include",
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
      const res = await fetch(`${BASE}/student/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) return alert("Failed to delete student");

      setStudents(students.filter((s) => s.id !== id));

    } catch (err) {
      console.log(err);
      alert("Could not connect to backend");
    }
  };
  const startIndex = (page - 1) * studentsPerPage;
  const paginatedStudents = students.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  return (
    <div className="bg-white p-6   max-w-5xl mx-auto flex flex-col justify-center gap-4 mt-8  sm:max-w-lg rounded-xl shadow-md w-full ">
      {/* Step 2: Select Action */}
      {!selectedAction && (

        <>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4 mb-8">
            <h2 className="text-xl font-semibold text-center ">Select </h2>
            <button
              onClick={() => setSelectedAction("add")}
              className="flex items-center gap-2 bg-yellow-500 text-white  px-4 py-3 flex-1 rounded w-full sm:w-auto hover:bg-yellow-600 transition"
            >
              <FaUserPlus className="w-5 h-5" /> Add Student
            </button>
            <button
              onClick={() => setSelectedAction("edit")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full sm:w-auto hover:bg-yellow-600 transition"

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
        </>
      )}

      {/* Add Student Form */}
      {selectedAction === "add" && (
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
              <select className="border rounded h-10 px-2 w-full max-w-xs "
                value={studentDepartment}
                onChange={(e) => setStudentDepartment(e.target.value)}>
                <option value="Accounting"> Accounting</option>
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

              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              + Add Student
            </button>
          </div>
        </>

      )}

      {selectedAction === "edit" && (
        <div className="w-full p-1">

          {/* Search Bar */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <input
                type="text"
                placeholder="Search by ID…"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="border px-2 py-1 rounded w-32 sm:w-4"
              />
              <button
                onClick={fetchStudentById}
                className="p-2 bg-blue-600 text-white rounded flex items-center justify-center"
              >
                <FaSearch className="w-4 h-4" />
              </button>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="p-2 bg-gray-200 rounded flex items-center justify-center"
              >
                <FaFilter className="w-4 h-4" />
              </button>
            </div>
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
          <div className="mt-4 space-y-4 w-full max-w-full overflow-hidden">
            {paginatedStudents.map((s) => (
              <div key={s.id} className="border rounded p-3 shadow bg-white w-full break-words">
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
                <div className="mt-2 text-lg">
                  <p >Name: {s.firstname} {s.lastname}</p>
                  <p >Department: {s.department}</p>
                  <p >Phone: {s.phone}</p>
                  <p >Gender: {s.gender}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {selectedAction === "view" && students.length > 0 && (
        <div className="flex flex-col gap-4 mt-4">
          {paginatedStudents.map((s) => (
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
          <div className="bg-white p-6 rounded-lg w-full max-w-sm sm:max-w overflow-hidden  max-h-[90vh] overflow-y-auto shadow-lg">


            <h2 className="font-semibold text-lg mb-4">Edit Student</h2>

            <div className="flex flex-col gap-3 max-w-full">
              <input
                type="text"
                value={studentFirstName}
                onChange={(e) => setStudentFirstName(e.target.value)}
                placeholder="First Name"
                className="border px-3 py-2 rounded w-full max-w-full box-border"

              />
              <input
                type="text"
                value={studentLastName}
                onChange={(e) => setStudentLastName(e.target.value)}
                placeholder="Last Name"
                className="border px-3 py-2 rounded w-full max-w-full box-border"

              />
              <input
                type="tel"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="Phone"
                className="border px-3 py-2 rounded w-full max-w-full box-border"

              />
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="Email"
                className="border px-3 py-2 rounded w-full max-w-full box-border"

              />

              <input
                type="text"
                value={studentDepartment}
                onChange={(e) => setStudentDepartment(e.target.value)}
                placeholder="Department"
                className="border px-3 py-2 rounded w-full max-w-full box-border"

              />
              <select
                value={studentGender}
                onChange={(e) => setStudentGender(e.target.value)}
                className="border px-3 py-2 rounded  max-w-xs overflow-hidden box-border "

              >
                <option value="male" className="w-50%">Male</option>
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
                  await fetchStudents();
                  setShowEditPopup(false);
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded"
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
            <br></br>
            <p className="font-bold mt-2 ring-black">{studentFirstName} {studentLastName}</p>

            <p>Phone Number: {studentPhone}</p>


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
