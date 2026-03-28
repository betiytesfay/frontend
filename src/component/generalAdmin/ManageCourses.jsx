import React, { useState, useEffect } from "react";
import { FaBook, FaEdit, FaTrash, FaPlus, FaEye, FaSearch, FaFilter, FaUserPlus, FaArrowLeft } from "react-icons/fa";


const BASE = "https://gibi-backend-669108940571.us-central1.run.app";

const normalizeCourse = (raw) => {
  if (!raw) return null;
  return {
    id: raw.course_id || raw.id || null,
    name: raw.course_name || raw.name || raw.courseName || '',
    description: raw.description || raw.desc || '',
    raw,
  };
};

const ManageCourses = ({ setSelectedCategory }) => {

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courses, setCourses] = useState([]);

  // === UI States ===
  const [selectedAction, setSelectedAction] = useState(""); // add / edit / delete / view
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [searchId, setSearchId] = useState("");
  const [activeModal, setActiveModal] = useState(null);

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  const paginatedCourses = courses.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // === Filters ===

  const [showFilter, setShowFilter] = useState(false);
  const [filterName, setFilterName] = useState("");
  // === API base is BASE + /course when used ===

  useEffect(() => {

    fetchCourses();

  }, [selectedAction]);
  useEffect(() => {
    setPage(1);
  }, [courses]);



  // === Filter Courses ===
  const [allCourses, setAllCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${BASE}/course`, { credentials: 'include' });
      if (!res.ok) throw new Error("Backend error");

      const payload = await res.json();
      const list = payload?.data?.courses || payload?.courses || payload || [];
      const normalizedList = Array.isArray(list) ? list.map(normalizeCourse).filter(Boolean) : [];
      setCourses(normalizedList);
      setAllCourses(normalizedList);
    } catch (err) {
      console.error(err);
      setCourses([]);
      setAllCourses([]);
    }
  };

  const fetchCourseById = async () => {
    if (!searchId.trim()) {
      alert("Please enter a course ID");
      return;
    }

    try {
      const res = await fetch(`${BASE}/course/${encodeURIComponent(searchId)}`, { credentials: 'include' });
      if (!res.ok) {
        alert("Course not found");
        return;
      }
      const payload = await res.json();
      const courseData = payload?.data?.course || payload?.course || payload;
      if (courseData) {
        setCourses([normalizeCourse(courseData)].filter(Boolean));
      } else {
        alert("Course not found");
      }
    } catch (err) {
      console.error(err);
      alert("Backend not reachable");
    }
  };
  const fetchCourseAndOpenView = (id) => {
    const course = courses.find(c => c.id === id);
    if (course) {
      setSelectedCourse(course);
      setSelectedAction("detail");
    }
  };

  const applyFilter = () => {
    const filtered = allCourses.filter(c =>
      (c.name || '').toLowerCase().includes((filterName || '').toLowerCase())
    );
    setCourses(filtered);
  };
  // === Add new course ===
  const handleAddCourse = async () => {
    if (!courseName.trim()) {
      return alert("Course name is required");
    }

    const newCourse = {
      course_name: courseName,
      description: courseDescription,
    };

    const res = await fetch(`${BASE}/course`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
      credentials: 'include'
    });

    if (!res.ok) return alert("Failed to add course");

    await fetchCourses();
    setShowAddPopup(false);
    setCourseName("");
    setCourseDescription("");
  };

  // === Edit Course ===
  const openEditForm = (c) => {
    const n = normalizeCourse(c);
    setSelectedCourse(n);
    setCourseName(n.name);
    setCourseDescription(n.description);
    setShowEditPopup(true);
    setSelectedAction("");
  };

  const handleSaveEditCourse = async () => {
    if (!selectedCourse?.id) return;

    const updated = {
      course_name: courseName,
      description: courseDescription,
    };

    const res = await fetch(`${BASE}/course/${encodeURIComponent(selectedCourse.id)}`, {  // ✅ Use selectedCourse.id
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
      credentials: 'include'
    });

    if (!res.ok) return alert("Failed to update");

    await fetchCourses();
    setShowEditPopup(false);
  };

  // === Delete Course ===
  const openDeleteConfirm = (c) => {
    setSelectedCourse(c);
    setShowDeletePopup(true);
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse?.id) return;
    const res = await fetch(`${BASE}/course/${encodeURIComponent(selectedCourse.id)}`, { method: "DELETE", credentials: 'include' });
    if (!res.ok) return alert("Failed to delete");

    await fetchCourses();
    setShowDeletePopup(false);
  };

  return (
    <div className="bg-white p-6 max-w-5xl mx-auto flex flex-col justify-center gap-4 mt-8 sm:max-w-lg rounded-xl shadow-md w-full">


      {/* Search + Filter */}
      <div className="items-center justify-between flex">
        <button
          onClick={() => {

            setShowEditPopup(false);
            setShowAddPopup(false);
            setShowDeletePopup(false);
            setPage(1);

            if (selectedAction) {
              setSelectedAction("");
            }
            else if (setSelectedCategory) {
              setSelectedCategory("");
            }

            else {
              fetchCourses();
            }
          }}
          className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaArrowLeft />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h2 className="font-bold text-lg">Course</h2>
        <button
          onClick={() => setSelectedAction("add")}
          className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
        >
          <FaUserPlus />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>
      {!selectedAction && (
        <>
          <div className="mb-4 flex flex-row">
            <input
              type="text"
              placeholder="search courses.."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchCourseById()}
              className="border px-3 py-2 rounded w-full"
            />

            <button
              onClick={() => { }}
              className="p-2 bg-[#D7B450] rounded"
            >
              <FaFilter className="w-5 h-5" />
            </button>
          </div>
          {showFilter && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Filter by name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <button onClick={applyFilter} className="px-3 py-1 bg-[#D7B450] text-white rounded">
                Apply
              </button>
            </div>
          )}


          <div className="flex flex-col gap-3 mt-2 px-2">
            {/* PC Table View */}
            <div className="hidden sm:block w-full  overflow-x-auto mt-2">
              <table className="min-w-full w-full border-collapse border border-gray-200 shadow-sm rounded-lg">
                <thead className="bg-[#D7B450]">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">course_id</th>
                    <th className="px-4 py-2 text-left">course_name</th>
                    <th className="px-4 py-2 text-left">courseDescription</th>

                  </tr>
                </thead>
                <tbody>
                  {paginatedCourses.map((c, index) => (
                    <tr
                      key={c.id}
                      className="hover:bg-yellow-50 transition rounded-lg cursor-pointer"
                      onClick={() => fetchCourseAndOpenView(c.id)}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{c.id}</td>
                      <td className="px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2">{c.description}</td>

                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditForm(c); }}
                          className="px-2 py-1 bg-[#D7B450] text-white rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openDeleteConfirm(c); }}
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
              {paginatedCourses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCourse(c);
                    setSelectedAction("detail");
                  }}
                  className="border rounded p-3 flex justify-between items-center shadow bg-white cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-sm text-gray-500">{c.id}</p>
                  </div>

                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditForm(c); }}
                      className="text-[#D7B450]"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); openDeleteConfirm(c); }}
                      className="text-red-500"
                    >
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
                    : "bg-gray-200 hover:bg-[#D7B450]"}
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
                      ? "bg-[#D7B450] text-white font-semibold"
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
                    : "bg-gray-200 hover:bg-[#D7B450]"}
    `}
              >
                Next
              </button>

            </div>
          </div>
        </>
      )}
      {/* ADD COURSE */}
      {selectedAction === "add" && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-6">
            <h2 className="text-xl font-bold mb-3">Add Course</h2>
            <input
              type="text"
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="border px-3 py-2 rounded"
            />

            <input
              type="text"
              placeholder="Description"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="border px-3 py-2 rounded"
            />

            <button
              onClick={() => setShowAddPopup(true)}
              className="bg-[#D7B450] text-white px-4 py-2 rounded"
            >
              + Add Course
            </button>
          </div>
        </div>
      )}

      {/* EDIT / SEARCH */}
      {selectedAction === "edit" && (
        <div className="p-1 h-[85hv] flex flex-col">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by Course ID…"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />

            <button
              onClick={fetchCourseById}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              <FaSearch className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowFilter(!showFilter)}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              <FaFilter className="w-4 h-4" />
            </button>
          </div>


          {/* CARDS */}
          <div className="mt-4 space-y-4 flex-1 overflow-y-auto border-t border-b pt-3 pb-4">
            {courses.map((c) => (
              <div key={c.id} className="border rounded p-3 bg-white shadow">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>ID: {c.id}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(c)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => openDeleteConfirm(c)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-sm">
                  <p>Name: {c.name}</p>
                  <p>Description: {c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW */}

      {selectedAction === "detail" && selectedCourse && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="font-semibold text-lg mb-4">Course Details</h2>

            <p><strong>ID:</strong> {selectedCourse.id}</p>
            <p><strong>Name:</strong> {selectedCourse.name}</p>
            <p><strong>Description:</strong> {selectedCourse.description || 'No description'}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  openEditForm(selectedCourse);
                  setSelectedAction("");
                }}
                className="flex-1 px-4 py-2 bg-[#D7B450] text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={() => {
                  openDeleteConfirm(selectedCourse);
                  setSelectedAction("");
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedAction("");
                setSelectedCourse(null);
              }}
              className="w-full px-4 py-2 bg-gray-300 rounded mt-2 hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ADD POPUP */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-80">
            <p className="font-bold text-lg">Confirm Add Course?</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowAddPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddCourse}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT POPUP */}

      {showEditPopup && selectedCourse && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="font-semibold text-lg mb-4">Edit Course</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Course Name"
                className="border px-3 py-2 rounded w-full"
              />

              <textarea
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="Description"
                rows="4"
                className="border px-3 py-2 rounded w-full"
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setShowEditPopup(false);
                  setCourseName("");
                  setCourseDescription("");
                  setSelectedCourse(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleSaveEditCourse();
                  setShowEditPopup(false);
                }}
                className="px-4 py-2 bg-[#D7B450] text-white rounded hover:bg-yellow-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}


      {/* DELETE POPUP */}
      {showDeletePopup && selectedCourse && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-80 shadow">
            <p className="text-lg font-semibold">Confirm Delete</p>

            <p className="mt-2 font-bold">{selectedCourse.name}</p>
            <p>({selectedCourse.description})</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDeleteCourse(selectedCourse.id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageCourses;
