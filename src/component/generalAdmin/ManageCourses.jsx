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

const ManageCourses = () => {
  // === Course States ===
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

  // === Filters ===

  const [showFilter, setShowFilter] = useState(false);
  const [filterName, setFilterName] = useState("");
  // === API base is BASE + /course when used ===

  useEffect(() => {
    if (selectedAction === "view") {
      fetchCourses();
    }
  }, [selectedAction]);

  // === Search by course id ===
  const fetchCourseById = async () => {
    try {
      const res = await fetch(`${BASE}/course/${encodeURIComponent(searchId)}`, { credentials: 'include' });
      if (!res.ok) {
        alert("Course not found");
        return;
      }
      const payload = await res.json();
      const obj = payload.data || payload || {};
      setCourses([normalizeCourse(obj)]);
    } catch (err) {
      alert("Backend not reachable");
    }
  };

  // === Filter Courses ===
  const [allCourses, setAllCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${BASE}/course`, { credentials: 'include' });
      if (!res.ok) throw new Error("Backend error");

      const payload = await res.json();
      const list = Array.isArray(payload) ? payload : (payload.data || payload.courses || payload);
      const normalized = (list || []).map(normalizeCourse);
      setCourses(normalized);
      setAllCourses(normalized);
    } catch (err) {
      console.error(err);
      setCourses([]);
      setAllCourses([]);
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
    if (!courseName) {
      return alert("Fill all fields");
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
  };

  const handleSaveEditCourse = async (id) => {
    const updated = {
      course_name: courseName,
      description: courseDescription,
    };

    const res = await fetch(`${BASE}/course/${encodeURIComponent(id)}`, {
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

  const handleDeleteCourse = async (id) => {
    const res = await fetch(`${BASE}/course/${encodeURIComponent(id)}`, { method: "DELETE", credentials: 'include' });

    if (!res.ok) return alert("Failed to delete");

    await fetchCourses();
    setShowDeletePopup(false);
  };

  return (
    <div className="bg-white px-3 mt-8 rounded-lg w-full max-w-3xl ms:max-w-lg mx-auto">

      <div className="flex flex-col gap-3 mb-4 px-2">
        {/* Search + Filter */}
        <div className="flex items-center gap-2 w-full relative">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter course id"
              value={searchId}
              onFocus={() => setIsSearchActive(true)}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchCourseById()}
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
            onClick={() => "/admin"}
            className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            <FaArrowLeft /> Back
          </button>
          <h2 className="font-bold text-lg">Course</h2>
          <button
            onClick={() => setSelectedAction("add")}
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
                  onClick={() => fetchCourseAndOpenView(s.id)}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{c.id}</td>
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.description}</td>

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
          {paginatedCourses.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setSelectedCourse(c);
                setSelectedAction("detail");
              }}
              className="border rounded p-3 flex justify-between items-center shadow bg-white cursor-pointer"
            >

              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-500">{c.id}</p>
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
              className="bg-yellow-500 text-white px-4 py-2 rounded"
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
              onClick={fetchCourseByCode}
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
      {selectedAction === "detail" && (
        <div className="mt-4 space-y-4">
          {courses.map((c) => (
            <div key={c.id} className="p-4 rounded bg-white shadow border">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="font-semibold">ID: {c.id}</span>
                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => {
                      setCourseName(selectedCourse.name);
                      setCourseDescription(selectedCourse.description);
                      setSelectedAction("edit");
                    }}
                    className="px-2 py-1 bg-yellow-600 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCourse(c);
                      setSelectedAction("delete");
                    }}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <p><strong>Name:</strong> {c.name}</p>
                <p><strong>Description:</strong> {c.description}</p>
              </div>
            </div>
          ))}
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
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-80">
            <p className="font-bold">Confirm Edit?</p>

            <div className="flex justify-between mt-4">
              <button onClick={() => setShowEditPopup(false)}>
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleSaveEditCourse(selectedCourse.id);
                  setShowEditPopup(false);
                  setSelectedAction("");
                }}
              >
                Yes
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
