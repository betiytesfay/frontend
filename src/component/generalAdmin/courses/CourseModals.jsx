import React from "react";
import { useCourseStore } from "../../../stores/useCourseStore";

export const CourseModals = () => {
  const {
    selectedCourse,
    courseName, setCourseName,
    courseDescription, setCourseDescription,
    showAddPopup, setShowAddPopup, addCourse,
    showEditPopup, setShowEditPopup, editCourse,
    showDeletePopup, setShowDeletePopup, deleteCourse,
  } = useCourseStore();

  return (
    <>
      {/* Add Course Modal */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">Add New Course</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Course Name:</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Course Name"
                  className="border px-3 py-2 rounded w-full mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description:</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Course Description"
                  rows={3}
                  className="border px-3 py-2 rounded w-full mt-1"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowAddPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={addCourse}
                className="px-4 py-2 bg-[#D7B450] text-white rounded hover:bg-yellow-600 transition"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditPopup && selectedCourse && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">Edit Course</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Course Name:</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Course Name"
                  className="border px-3 py-2 rounded w-full mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description:</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Course Description"
                  rows={3}
                  className="border px-3 py-2 rounded w-full mt-1"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowEditPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={editCourse}
                className="px-4 py-2 bg-[#D7B450] text-white rounded hover:bg-yellow-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Course Modal */}
      {showDeletePopup && selectedCourse && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h2 className="font-semibold text-lg mb-2 text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete course:</p>
            <p className="font-bold mt-2 text-gray-800">{selectedCourse.name}</p>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteCourse(selectedCourse.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
