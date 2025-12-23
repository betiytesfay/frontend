import React, { useState, useEffect } from "react";
import { FaBook, FaEdit, FaTrash, FaPlus, FaEye, FaSearch, FaFilter } from "react-icons/fa";

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
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [searchId, setSearchId] = useState("");

  // === Filters ===

  const [showFilter, setShowFilter] = useState(false);
  const [filterName, setFilterName] = useState("");
  // === API URLs ===
  const BASE = "https://attendance-production-d583.up.railway.app/course";

  useEffect(() => {
    if (selectedAction === "view") {
      fetchCourses();
    }
  }, [selectedAction]);

  // === Search by course id ===
  const fetchCourseByCode = async () => {
    try {
      const res = await fetch(`${BASE}/${searchId}`);
      if (!res.ok) {
        alert("Course not found");
        return;
      }
      const data = await res.json();
      setCourses([data]);
    } catch (err) {
      alert("Backend not reachable");
    }
  };

  // === Filter Courses ===
  const [allCourses, setAllCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(BASE);
      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();
      setCourses(data);
      setAllCourses(data);
    } catch (err) {
      console.error(err);
      setCourses([]);
      setAllCourses([]);
    }
  };

  const applyFilter = () => {
    const filtered = allCourses.filter(c =>
      c.course_name.toLowerCase().includes(filterName.toLowerCase())
    );
    setCourses(filtered);
  };
  // === Add new course ===
  const handleAddCourse = async () => {
    if (!courseName) {
      return alert("Fill all fields");
    }

    const newCourse = {
      name: courseName,
      description: courseDescription,
    };

    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
    });

    if (!res.ok) return alert("Failed to add course");

    await fetchCourses();
    setShowAddPopup(false);
    setCourseName("");
    setCourseDescription("");
  };

  // === Edit Course ===
  const openEditForm = (c) => {
    setSelectedCourse(c);
    setCourseName(c.name);
    setCourseDescription(c.description);
    setShowEditPopup(true);
  };

  const handleSaveEditCourse = async (id) => {
    const updated = {
      name: courseName,
      description: courseDescription,
    };

    const res = await fetch(`${BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
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
    const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });

    if (!res.ok) return alert("Failed to delete");

    await fetchCourses();
    setShowDeletePopup(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-5xl mx-auto">

      {/* Action Buttons */}
      {!selectedAction && (
        <div className="flex flex-col gap-4 h-[40vh] justify-center items-center">
          <button
            onClick={() => setSelectedAction("add")}
            className="w-full bg-yellow-500 px-4 py-3 rounded text-white"
          >
            <FaPlus className="inline-block mr-2" />
            Add Course
          </button>

          <button
            onClick={() => setSelectedAction("edit")}
            className="w-full bg-yellow-500 px-4 py-3 rounded text-white"
          >
            <FaEdit className="inline-block mr-2" />
            Edit Course
          </button>

          <button
            onClick={() => setSelectedAction("delete")}
            className="w-full bg-yellow-500 px-4 py-3 rounded text-white"
          >
            <FaTrash className="inline-block mr-2" />
            Delete Course
          </button>

          <button
            onClick={() => setSelectedAction("view")}
            className="w-full bg-yellow-500 px-4 py-3 rounded text-white"
          >
            <FaEye className="inline-block mr-2" />
            View Courses
          </button>
        </div>
      )}

      {/* ADD COURSE */}
      {selectedAction === "add" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Add Course</h2>

          <div className="flex flex-col gap-3">
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
        <div>
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

          {showFilter && (
            <div className="mt-3 p-3 border rounded bg-white shadow">
              <input
                type="text"
                placeholder="Course Name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-2"
              />
              <button
                onClick={applyFilter}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>
          )}

          {/* CARDS */}
          <div className="mt-4 space-y-4">
            {courses.map((c) => (
              <div key={c.course_idid} className="border rounded p-3 bg-white shadow">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>ID: {c.course_id}</span>
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
      {selectedAction === "view" && (
        <div className="mt-4 space-y-4">
          {courses.map((c) => (
            <div key={c.course_id} className="p-4 rounded bg-white shadow border">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="font-semibold">ID: {c.course_id}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCourse(c);
                      setShowViewPopup(true);
                    }}
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() => openEditForm(c)}
                    className="px-2 py-1 bg-yellow-600 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => openDeleteConfirm(c)}
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
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="font-semibold text-lg mb-4">Edit Course</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Course Name"
                className="border px-3 py-2 rounded w-full"
              />

              <input
                type="text"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="description.."
                className="border px-3 py-2 rounded w-full"
              />
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
                  if (selectedCourse) {
                    await handleSaveEditCourse(selectedCourse.id);
                    await fetchCourses();
                    setShowEditPopup(false);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
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

      {/* VIEW POPUP */}
      {showViewPopup && selectedCourse && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-80 shadow">
            <h2 className="font-bold text-lg mb-2">Course Details</h2>

            <p><strong>Name:</strong> {selectedCourse.name}</p>
            <p><strong>Description:</strong> {selectedCourse.description}</p>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowViewPopup(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageCourses;
