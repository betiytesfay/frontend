import React, { useState } from "react";
import { FaUserPlus, FaUserEdit, FaArrowLeft, FaUserMinus, FaUserCircle, FaSearch, FaFilter, FaEdit, FaTrash } from "react-icons/fa";
import { toEthiopian } from 'ethiopian-date';


const BASE = "https://gibi-backend-669108940571.us-central1.run.app";

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
  const [studentId, setStudentId] = useState("");
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
  const searchStudents = async () => {
    try {
      const q = new URLSearchParams();
      if (searchId) q.set('query', searchId); // searchId can be name or ID
      if (filterName) q.set('name', filterName);
      if (filterDepartment) q.set('department', filterDepartment);

      const res = await fetch(`${BASE}/student?${q.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) return alert('No students found');

      const payload = await res.json();
      const list = Array.isArray(payload) ? payload : (payload.data || payload.students || []);
      setStudents(list.map(normalizeStudent));
    } catch (err) {
      console.error(err);
      alert('Search failed');
    }
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

    const search = searchId.trim();
    if (!search) {
      fetchStudents();
      return;
    }
    const fullId = search.startsWith("UGR-") ? search : `UGR-${search}`;
    try {
      const res = await fetch(`${BASE}/student/${encodeURIComponent(fullId)}`, {
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
      studentId,
      studentDepartment,
      studentEmail,
      studentPhone,
      studentGender,
    });

    // trim strings and validate
    const f = (studentFirstName || "").trim();
    const l = (studentLastName || "").trim();
    const id = (studentId || "").trim();
    const dept = (studentDepartment || "").toString().trim();
    const email = (studentEmail || "").trim();
    const phone = (studentPhone || "").toString().trim();
    const gender = (studentGender || "").toString().trim();

    if (!f || !l || !dept || !email || !phone || !gender || !id) {
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
    const dupId = studentList.find(
      (s) => s && ((s.id && s.id === studentId) || (s.student_id && s.student_id === studentId))
    );
    if (dupId) return alert('A student with this ID already exists.');
    const dupPhone = studentList.find(
      (s) => s && ((s.phone && s.phone === phone) || (s.phone_number && s.phone_number === phone)),
    );
    if (dupPhone) return alert('A student with this phone number already exists.');

    const now = new Date();
    const [etYear, etMonth, etDay] = toEthiopian(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const etDate = `${etYear}-${String(etMonth).padStart(2, '0')}-${String(etDay).padStart(2, '0')}`;

    const newStudent = {
      student_id: id,
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
    setStudentId("");
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
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(updateStudent),
        credentials: "include",
      });

      if (!res.ok) {
        let body = '<no body>';
        try { body = await res.text(); } catch (e) { }
        console.error('Update failed', res.status, body);
        return alert(`Failed to update student: ${res.status} ${body}`);
      }

      // refresh list from server
      await fetchStudents();

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
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        let body = '<no body>';
        try { body = await res.text(); } catch (e) { }
        console.error('Delete failed', res.status, body);
        return alert(`Failed to delete student: ${res.status} ${body}`);
      }

      // Refresh canonical list from server
      await fetchStudents();

    } catch (err) {
      console.log(err);
      alert("Could not connect to backend");
    }
  };

  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  const searchStudentHandler = () => {
    if (searchId.trim() === "") return; // avoid empty search
    searchStudent(searchId); // send to backend
  };

  // fetch and open view for a single student id (ensures fresh data)
  const fetchStudentAndOpenView = async (id) => {
    try {
      const res = await fetch(`${BASE}/student/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) {
        let body = '<no body>';
        try { body = await res.text(); } catch (e) { }
        console.error('Fetch single student failed', res.status, body);
        return alert('Failed to load student details');
      }

      const payload = await res.json();
      const obj = payload.data || payload || {};
      setSelectedStudent(normalizeStudent(obj));
      setShowViewPopup(true);
    } catch (err) {
      console.error(err);
      alert('Could not fetch student');
    }
  };
  const startIndex = (page - 1) * studentsPerPage;
  const paginatedStudents = students.slice(
    startIndex,
    startIndex + studentsPerPage
  );
  const totalPages = Math.ceil(students.length / studentsPerPage);


  return (
    <div className="bg-white p-6   max-w-7xl mx-auto flex flex-col justify-center gap-4 mt-8  sm:max-w-lg rounded-xl shadow-md w-full ">

      <div className="flex flex-col gap-3 mb-4 px-2">
        {/* Search + Filter */}
        <div className="flex items-center gap-2 w-full relative">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter Id(0000-00)"
              value={searchId}
              onFocus={() => setIsSearchActive(true)}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchStudentById()}
              className="flex-1 border rounded px-3 py-2 pr-10"
            />

          </div>
          <button
            onClick={() => {
              setShowFilter(!showFilter)
            }}
            className="p-2 bg-yellow-600 rounded"
          >
            <FaFilter className="w-5 h-5" />
          </button>
        </div>

        {/* Title + Add Button */}
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            <FaArrowLeft /> Back
          </button>
          <h2 className="font-bold text-lg">Students</h2>
          <button
            onClick={() => setShowAddPopup(true)}
            className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
          >
            <FaUserPlus /> Add
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-2 px-2">
        {/* PC Table View */}
        <div className="hidden sm:block w-full  overflow-x-auto mt-2">
          <table className="min-w-full w-full border-collapse border border-gray-200 shadow-sm rounded-lg">
            <thead className="bg-yellow-100">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Gender</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((s, index) => (
                <tr
                  key={s.id}
                  className="hover:bg-yellow-50 transition rounded-lg cursor-pointer"
                  onClick={() => fetchStudentAndOpenView(s.id)}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{s.firstname} {s.lastname}</td>
                  <td className="px-4 py-2">{s.gender}</td>
                  <td className="px-4 py-2">{s.department}</td>
                  <td className="px-4 py-2">{s.phone}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditForm(s); }}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openDeleteConfirm(s); }}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sm:hidden">
          {paginatedStudents.map((s) => (
            <div
              key={s.id}
              onClick={() => fetchStudentAndOpenView(s.id)}
              className="border rounded p-3 flex justify-between items-center shadow bg-white cursor-pointer"
            >

              <div>
                <p className="font-semibold">{s.firstname} {s.lastname}</p>
                <p className="text-sm text-gray-500">{s.id}</p>
              </div>

              {/* Right: Edit / Delete */}
              <div className="sm:hidden mt-2 flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); openEditForm(s); }} className="text-yellow-500">
                  <FaEdit />
                </button>
                <button onClick={(e) => { e.stopPropagation(); openDeleteConfirm(s); }} className="text-red-500">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-4 flex-wrap">

          {/* Prev */}
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded transition
      ${page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-yellow-400"}
    `}
          >
            Prev
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded transition
        ${p === page
                  ? "bg-yellow-500 text-white font-semibold"
                  : "bg-gray-200 text-gray-700 hover:bg-yellow-400"}
      `}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded transition
      ${page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-yellow-400"}
    `}
          >
            Next
          </button>

        </div>
      </div>
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
              <label className="text-sm font-medium">ID:</label>
              <input
                type="text"
                placeholder="1234-16"
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
              <div key={s.id} className="border rounded p-3 shadow bg-white w-full wrap-break-words">
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
                    onClick={() => fetchStudentAndOpenView(s.id)}
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
