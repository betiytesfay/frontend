import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaUserGraduate, FaBook, FaLayerGroup, FaUserShield, FaUserCircle, FaUserPlus, FaUserEdit, FaUserMinus, FaEye } from "react-icons/fa";

import ManageStudents from "../component/generalAdmin/manageStudent.jsx";

import axios from "axios";


const GeneralAdmin = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(""); // "students", "courses", "batches", "admins"
  const [selectedAction, setSelectedAction] = useState("");     // "add", "edit", "delete", "transfer"

  // === Tab Control ===
  const [activeTab, setActiveTab] = useState("students"); // students, courses, batches

  // === Academic Dates ===
  const [academicYear, setAcademicYear] = useState("");
  const [academicDate, setAcademicDate] = useState("");
  const [academicEntries, setAcademicEntries] = useState([]);




  const handleAddAcademicDate = () => {
    if (academicYear && academicDate) {
      const newEntry = { id: crypto.randomUUID(), year: academicYear, date: academicDate };
      setAcademicEntries([...academicEntries, newEntry]);
      setAcademicYear("");
      setAcademicDate("");
    } else alert("Please enter both year and date.");
  };

  const handleDeleteAcademic = (id) => setAcademicEntries(academicEntries.filter((e) => e.id !== id));

  const handleEditAcademic = (id) => {
    const entry = academicEntries.find((e) => e.id === id);
    if (entry) {
      setAcademicYear(entry.year);
      setAcademicDate(entry.date);
      setAcademicEntries(academicEntries.filter((e) => e.id !== id));
    }
  };

  // === Courses ===
  const [courseYear, setCourseYear] = useState("1st Year");
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseEntries, setCourseEntries] = useState([]);
  const [courseId, setCourseId] = useState("");


  const handleAddCourse = () => {
    if (courseName && courseId) {
      const newCourse = { id: crypto.randomUUID(), year: courseYear, name: courseName, courseId };
      setCourseEntries([...courseEntries, newCourse]);
      setCourseName("");
      setCourseDescription("");
    } else alert("Please enter course name and ID.");
  };

  const handleDeleteCourse = (id) => setCourseEntries(courseEntries.filter((c) => c.id !== id));

  const handleEditCourse = (id) => {
    const course = courseEntries.find((c) => c.id === id);
    if (course) {
      setCourseYear(course.year);
      setCourseName(course.name);
      setCourseDescription(course.courseDescription);
      setCourseEntries(courseEntries.filter((c) => c.id !== id));
    }
  };

  // // === Students ===
  // const [studentName, setStudentName] = useState("");
  // const [studentYear, setStudentYear] = useState("1st Year");
  // const [studentCourse, setStudentCourse] = useState("");
  // const [studentPhone, setStudentPhone] = useState("");
  // const [studentGender, setStudentGender] = useState("male");
  // const [studentAge, setStudentAge] = useState("");
  // const [students, setStudents] = useState([]);

  // const handleAddStudent = async () => {
  //   if (studentName && studentCourse && studentPhone && studentAge) {
  //     const newStudent = {
  //       student_id: studentPhone, // or use a proper ID
  //       first_name: studentName,
  //       last_name: "",
  //       email: "",
  //       enrollment_date: new Date().toISOString(),
  //       is_certified: false,
  //       current_batch_id: 1, // set appropriate batch ID
  //       phone_number: studentPhone,
  //       department: studentCourse,
  //     };

  //     try {
  //       const response = await axios.post("http://localhost:9800/students", newStudent);
  //       console.log("Student added:", response.data);
  //       // update local state
  //       setStudents([...students, response.data.createdStudent]);
  //       setStudentName("");
  //       setStudentCourse("");
  //       setStudentPhone("");
  //       setStudentAge("");
  //     } catch (err) {
  //       console.error("Error adding student:", err);
  //       alert("Failed to add student");
  //     }
  //   } else alert("Please fill out all student info.");
  // };


  // const handleDeleteStudent = (id) => setStudents(students.filter((s) => s.id !== id));

  // const handleEditStudent = (id) => {
  //   const student = students.find((s) => s.id === id);
  //   if (student) {
  //     setStudentName(student.name);
  //     setStudentYear(student.year);
  //     setStudentCourse(student.course);
  //     setStudentPhone(student.phone);
  //     setStudentGender(student.gender);
  //     setStudentAge(student.age);
  //     setStudents(students.filter((s) => s.id !== id));
  //   }
  // };

  // === Session Admins ===
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminGender, setAdminGender] = useState("male");
  const [adminAge, setAdminAge] = useState("");
  const [admins, setAdmins] = useState([]);

  const handleAddAdmin = () => {
    if (adminName && adminPassword && adminPhone && adminAge) {
      const newAdmin = {
        id: crypto.randomUUID(),
        name: adminName,
        password: adminPassword,
        phone: adminPhone,
        gender: adminGender,
        age: adminAge,
      };
      setAdmins([...admins, newAdmin]);
      setAdminName("");
      setAdminPassword("");
      setAdminPhone("");
      setAdminAge("");
    } else alert("Please fill out all admin info.");
  };

  const handleDeleteAdmin = (id) => setAdmins(admins.filter((a) => a.id !== id));

  const handleEditAdmin = (id) => {
    const admin = admins.find((a) => a.id === id);
    if (admin) {
      setAdminName(admin.name);
      setAdminPassword(admin.password);
      setAdminPhone(admin.phone);
      setAdminGender(admin.gender);
      setAdminAge(admin.age);
      setAdmins(admins.filter((a) => a.id !== id));
    }
  };

  // === Batches ===
  const [batchYear, setBatchYear] = useState("1st Year");
  const [ethiopianYear, setEthiopianYear] = useState("");
  const [batchCourses, setBatchCourses] = useState({ firstSemester: [], secondSemester: "" });
  const [batches, setBatches] = useState([]);

  const handleAddBatch = () => {
    if (!ethiopianYear || batchCourses.firstSemester.length !== 2 || !batchCourses.secondSemester) {
      return alert("Please select Ethiopian year and assign courses correctly.");
    }
    const newBatch = {
      id: crypto.randomUUID(),
      year: batchYear,
      ethiopianYear,
      courses: { ...batchCourses },
    };
    setBatches([...batches, newBatch]);
    setBatchCourses({ firstSemester: [], secondSemester: "" });
    setEthiopianYear("");
  };

  const handleDeleteBatch = (id) => setBatches(batches.filter((b) => b.id !== id));

  const handleEditBatch = (id) => {
    const batch = batches.find((b) => b.id === id);
    if (batch) {
      setBatchYear(batch.year);
      setEthiopianYear(batch.ethiopianYear);
      setBatchCourses({ ...batch.courses });
      setBatches(batches.filter((b) => b.id !== id));
    }
  };

  // === Transfer Students ===
  const handleTransferStudents = (fromBatchId, toBatchId) => {
    const fromBatch = batches.find((b) => b.id === fromBatchId);
    const toBatch = batches.find((b) => b.id === toBatchId);
    if (!fromBatch || !toBatch) return alert("Invalid batch selection.");

    // transfer students from fromBatch.year to toBatch.year
    const updatedStudents = students.map((s) => (s.year === fromBatch.year ? { ...s, year: toBatch.year } : s));
    setStudents(updatedStudents);
    alert(`Students from ${fromBatch.year} transferred to ${toBatch.year}.`);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-cover bg-center p-8 overflow-x-hidden" style={{ backgroundAttachment: 'fixed', backgroundImage: "url('/gbiphoto.jpg')" }}>
      <div className="bg-white p-6 rounded-lg  items-center shadow-lg max-w-sm mx-auto h-[80vh]  justify-center gap-6">


        {!selectedCategory && (
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl">
              Welcome Back,<br />
              <span className="font-extrabold">General Admin</span>
            </h1>
            <FaUserCircle className="w-10 h-10 text-gray-700" />
          </div>
        )}



        {/* Tabs */}

        {/* Step 1: Select Category */}
        {!selectedCategory && (

          <div className="max-w-sm bg-white/70 p-4 rounded-xl shadow-md  w-full">
            <h2 className="text-lg font-semibold text-center mb-4">Manage</h2>

            <div className="flex flex-col gap-4">
              <button onClick={() => setSelectedCategory("students")}
                className="flex items-center gap-3 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 active:scale-95 transition">
                <FaUserGraduate className="w-6 h-6" />
                Students
              </button>
              <button onClick={() => setSelectedCategory("courses")}
                className="flex items-center gap-3 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 active:scale-95 transition">
                <FaBook className="w-6 h-6" />
                Courses
              </button>
              <button onClick={() => setSelectedCategory("batches")}
                className="flex items-center gap-3 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 active:scale-95 transition">
                <FaLayerGroup className="w-6 h-6" />
                Batches
              </button>
              <button onClick={() => setSelectedCategory("admins")}
                className="flex items-center gap-3 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 active:scale-95 transition">
                <FaUserShield className="w-6 h-6" />
                Session Admins
              </button>
            </div>
          </div>
        )}
        {selectedCategory === "students" && <ManageStudents />}


        {/* Step 2: Select Action for Courses */}
        {selectedCategory === "courses" && !selectedAction && (
          <div className="flex flex-col justify-center gap-4 h-[40vh] max-w-sm bg-white/50 p-4 rounded-xl shadow-md w-full">
            <h2 className="text-xl font-semibold text-center">Select One</h2>
            <button
              onClick={() => setSelectedAction("add")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition"
            >
              <FaBook className="w-5 h-5" /> Add Course
            </button>
            <button
              onClick={() => setSelectedAction("edit")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition"
            >
              <FaUserEdit className="w-5 h-5" /> Edit Course
            </button>
            <button
              onClick={() => setSelectedAction("delete")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition"
            >
              <FaUserMinus className="w-5 h-5" /> Delete Course
            </button>
            <button
              onClick={() => setSelectedCategory("")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded w-full"
            >
              <FaEye className="w-5 h-5" /> View
            </button>
          </div>
        )}



        {/* Students Tab */}
        {/* {selectedCategory === "students" && selectedAction && (
          <div className="bg-white/90 p-6 rounded-lg shadow-md max-w-5xl mx-auto">
            {selectedAction === "add" && (
              <div>
                <h2 className="font-semibold mb-2">Add Student</h2>
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right">Name:</label>
                    <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="border rounded h-9 px-2 flex-1" />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right">Phone Number:</label>
                    <input type="text" placeholder="Phone Number" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} className="border rounded h-9 px-2 flex-1" />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right">Age:</label>
                    <input type="number" placeholder="Age" value={studentAge} onChange={(e) => setStudentAge(e.target.value)} className="border rounded h-9 px-2 flex-1" />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right">Year:</label>
                    <select value={studentYear} onChange={(e) => setStudentYear(e.target.value)} className="border rounded h-9 px-2  min-w-[200px] flex-1">
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right">Course:</label>
                    <input type="text" placeholder="Course Name" value={studentCourse} onChange={(e) => setStudentCourse(e.target.value)} className="border rounded h-9 px-2 flex-1" />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-32 text-right">Gender:</label>
                    <select value={studentGender} onChange={(e) => setStudentGender(e.target.value)} className="border rounded h-9 px-2 min-w-[200px]  flex-1">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button onClick={handleAddStudent} className="bg-yellow-500 text-white px-4 py-2 rounded align-items items-center hover:bg-yellow-600 transition mb-4">
                    + Add Student
                  </button>
                </div>

              </div>
            )}

            {(selectedAction === "edit" || selectedAction === "delete") && students.length > 0 && (
              <table className="w-full border border-gray-300 text-left text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th>Name</th><th>Year</th><th>Course</th><th>Phone</th><th>Gender</th><th>Age</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.year}</td>
                      <td>{s.course}</td>
                      <td>{s.phone}</td>
                      <td>{s.gender}</td>
                      <td>{s.age}</td>
                      <td className="flex gap-2">
                        {selectedAction === "edit" && <button onClick={() => handleEditStudent(s.id)} className="px-2 py-1 bg-[#D4AF35] text-white rounded hover:bg-yellow-600">Edit</button>}
                        {selectedAction === "delete" && <button onClick={() => handleDeleteStudent(s.id)} className="px-2 py-1 bg-[#D4AF35] text-white rounded hover:bg-yellow-600">Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )} */}

        {/* Courses Tab */}
        {selectedCategory === "courses" && selectedAction && (
          <div className="bg-white/90 p-6 rounded-lg shadow-md max-w-sm mx-auto">
            {selectedAction === "add" && (
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <title>Add Course </title>
                  <label>Year:</label>
                  <select value={courseYear} onChange={(e) => setCourseYear(e.target.value)} className="border rounded h-9 px-2 flex-1 min-w-[200px]">
                    <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <label>Course Name:</label>
                  <input type="text" placeholder="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="border rounded h-9 px-2" />
                </div>
                <div className="flex items-center gap-4">
                  <label>Description</label>
                  <input type="text" placeholder="Course Desciption" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} className="border rounded h-9 px-2" />
                </div>
                <button onClick={handleAddCourse} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition mb-4">+ Add Course</button>
              </div>
            )}

            {(selectedAction === "edit" || selectedAction === "delete") && courseEntries.length > 0 && (
              <table className="w-full border border-gray-300 text-left text-sm">
                <thead className="bg-gray-200">
                  <tr><th>Year</th><th>Name</th><th>Course ID</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {courseEntries.map((c) => (
                    <tr key={c.id}>
                      <td>{c.year}</td><td>{c.name}</td><td>{c.courseId}</td>
                      <td className="flex gap-2">
                        {selectedAction === "edit" && <button onClick={() => handleEditCourse(c.id)} className="px-2 py-1 bg-[#D4AF35] text-white rounded hover:bg-yellow-600">Edit</button>}
                        {selectedAction === "delete" && <button onClick={() => handleDeleteCourse(c.id)} className="px-2 py-1 bg-[#D4AF35] text-white rounded hover:bg-yellow-600">Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}


        {/* Batches Tab */}
        {selectedCategory === "batches" && selectedAction && (
          <div className="bg-white/90 p-6 rounded-lg shadow-md max-w-5xl mx-auto">

            <div className="flex flex-col justify-center gap-4 h-[40vh] max-w-sm bg-white/50 p-4 rounded-xl shadow-md w-full">
              <h2 className="text-xl font-semibold text-center">Select One</h2>

              <button onClick={() => setSelectedAction("add")}
                className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition">
                <FaUserPlus className="w-5 h-5" /> Add Batch
              </button>

              <button onClick={() => setSelectedAction("edit")}
                className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition">
                <FaUserEdit className="w-5 h-5" /> Edit Batch
              </button>

              <button onClick={() => setSelectedAction("delete")}
                className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition">
                <FaUserMinus className="w-5 h-5" /> Delete Batch
              </button>

              <button onClick={() => setSelectedAction("transfer")}
                className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition">
                <FaLayerGroup className="w-5 h-5" /> Transfer Students
              </button>

              <button onClick={() => setSelectedCategory("")}
                className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded w-full">
                <FaEye className="w-5 h-5" /> View Batches
              </button>
            </div>

          </div>

        )}
        {/* Batches Tab Buttons */}
        {selectedCategory === "batches" && !selectedAction && (
          <div className="flex flex-col justify-center gap-4 h-[40vh] max-w-sm bg-white/50 p-4 rounded-xl shadow-md w-full mx-auto">
            <h2 className="text-xl font-semibold text-center">Select One</h2>

            <button onClick={() => setSelectedAction("add")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition">
              <FaUserPlus className="w-5 h-5" /> Add Batch
            </button>

            <button onClick={() => setSelectedAction("edit")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition">
              <FaUserEdit className="w-5 h-5" /> Edit Batch
            </button>

            <button onClick={() => setSelectedAction("delete")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition">
              <FaUserMinus className="w-5 h-5" /> Delete Batch
            </button>

            <button onClick={() => setSelectedAction("transfer")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 transition">
              <FaLayerGroup className="w-5 h-5" /> Transfer Students
            </button>

            <button onClick={() => setSelectedCategory("")}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded w-full">
              <FaEye className="w-5 h-5" /> View Batches
            </button>
          </div>
        )}

        {/* ADD BATCH FORM */}
        {selectedCategory === "batches" && selectedAction === "add" && (
          <div className="bg-white/90 p-6 rounded-lg shadow-md max-w-5xl mx-auto">
            <button onClick={() => setSelectedAction("")} className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Back</button>
            <h2 className="font-semibold mb-2">Add New Batch</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <select value={batchYear} onChange={(e) => setBatchYear(e.target.value)} className="border rounded h-9 px-2">
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>

              <input
                type="text"
                placeholder="Ethiopian Academic Year"
                value={ethiopianYear}
                onChange={(e) => setEthiopianYear(e.target.value)}
                className="border rounded h-9 px-2"
              />

              <div>
                <label className="block">1st Semester Courses (Select 2):</label>
                <select
                  multiple
                  value={batchCourses.firstSemester}
                  onChange={(e) =>
                    setBatchCourses({ ...batchCourses, firstSemester: Array.from(e.target.selectedOptions, o => o.value) })
                  }
                  className="border rounded h-20 px-2 w-full"
                >
                  {courseEntries.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block">2nd Semester Course (Select 1):</label>
                <select
                  value={batchCourses.secondSemester}
                  onChange={(e) => setBatchCourses({ ...batchCourses, secondSemester: e.target.value })}
                  className="border rounded h-9 px-2 w-full"
                >
                  <option value="">Select Course</option>
                  {courseEntries.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={handleAddBatch}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition mb-4"
            >
              + Add Batch
            </button>
          </div>
        )}

        {/* TRANSFER STUDENTS FORM */}
        {selectedCategory === "batches" && selectedAction === "transfer" && batches.length > 1 && (
          <div className="bg-white/90 p-6 rounded-lg shadow-md max-w-5xl mx-auto">
            <button onClick={() => setSelectedAction("")} className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Back</button>
            <h2 className="font-semibold mb-2">Transfer Students to Another Batch</h2>
            <div className="flex gap-2 mb-4">
              <select id="fromBatch" className="border rounded h-9 px-2">
                <option value="">From Batch</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.year}</option>)}
              </select>

              <select id="toBatch" className="border rounded h-9 px-2">
                <option value="">To Batch</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.year}</option>)}
              </select>

              <button
                className="bg-[#D4AF35] text-white px-4 py-2 rounded hover:bg-yellow-600"
                onClick={() => {
                  const fromId = document.getElementById("fromBatch").value;
                  const toId = document.getElementById("toBatch").value;
                  handleTransferStudents(fromId, toId);
                }}
              >
                Transfer
              </button>
            </div>
          </div>
        )}

        {/* LIST OF BATCHES */}
        {selectedCategory === "batches" && batches.length > 0 && (
          <div className="bg-white/90 p-6 rounded-lg shadow-md max-w-5xl mx-auto">
            <table className="w-full border border-gray-300 text-left text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1 border">Year</th>
                  <th className="px-2 py-1 border">Ethiopian Year</th>
                  <th className="px-2 py-1 border">1st Sem Courses</th>
                  <th className="px-2 py-1 border">2nd Sem Course</th>
                  <th className="px-2 py-1 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {batches.map(b => (
                  <tr key={b.id}>
                    <td className="px-2 py-1 border">{b.year}</td>
                    <td className="px-2 py-1 border">{b.ethiopianYear}</td>
                    <td className="px-2 py-1 border">{b.courses.firstSemester.join(", ")}</td>
                    <td className="px-2 py-1 border">{b.courses.secondSemester}</td>
                    <td className="px-2 py-1 border flex gap-2">
                      <button
                        onClick={() => handleEditBatch(b.id)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBatch(b.id)}
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
        )}



        {selectedCategory === "admins" && selectedAction && (
          <div className="bg-white/90 p-6 rounded-lg shadow-md max-w-5xl mx-auto">
            {selectedAction === "add" && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                <input type="text" placeholder="Admin Name" value={adminName} onChange={(e) => setAdminName(e.target.value)} className="border rounded h-9 px-2" />
                <input type="password" placeholder="Password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="border rounded h-9 px-2" />
                <input type="text" placeholder="Phone" value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} className="border rounded h-9 px-2" />
                <select value={adminGender} onChange={(e) => setAdminGender(e.target.value)} className="border rounded h-9 px-2">
                  <option value="male">Male</option><option value="female">Female</option>
                </select>
                <input type="number" placeholder="Age" value={adminAge} onChange={(e) => setAdminAge(e.target.value)} className="border rounded h-9 px-2" />
                <button onClick={handleAddAdmin} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition mb-4">+ Add Admin</button>
              </div>
            )}

            {(selectedAction === "edit" || selectedAction === "delete") && admins.length > 0 && (
              <table className="w-full border border-gray-300 text-left text-sm">
                <thead className="bg-gray-200">
                  <tr><th>Name</th><th>Phone</th><th>Gender</th><th>Age</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {admins.map(a => (
                    <tr key={a.id}>
                      <td>{a.name}</td><td>{a.phone}</td><td>{a.gender}</td><td>{a.age}</td>
                      <td className="flex gap-2">
                        {selectedAction === "edit" && <button onClick={() => handleEditAdmin(a.id)} className="px-2 py-1 bg-[#D4AF35] text-white rounded hover:bg-yellow-600">Edit</button>}
                        {selectedAction === "delete" && <button onClick={() => handleDeleteAdmin(a.id)} className="px-2 py-1 bg-[#D4AF35] text-white rounded hover:bg-yellow-600">Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}


        {/* Bottom buttons */}
        <div className="flex justify-center gap-6 mt-12">

          <button
            onClick={() => {
              if (selectedAction) {
                setSelectedAction(""); // go back to category selection
              } else if (selectedCategory) {
                setSelectedCategory(""); // go back to main dashboard
              } else {
                navigate(-1); // fallback: go back in browser history
              }
            }}
            className="w-32 h-10 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
          >
            Back
          </button>

          <button className="w-32 h-10 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">Next</button>
        </div>
      </div>
    </div>
  )

};
export default GeneralAdmin;
