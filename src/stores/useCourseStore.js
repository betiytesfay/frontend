import { create } from "zustand";
import {
  fetchCoursesApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
} from "../services/courseService";
import { courseSchema } from "../schemas/courseSchema";
import { validateWithZod } from "../lib/zodUtils";

export const useCourseStore = create((set, get) => ({
  courses: [],
  selectedCourse: null,
  selectedAction: "",
  isLoading: false,
  error: null,

  // Form Fields
  courseName: "",
  courseDescription: "",

  // Filters & Search
  searchId: "",
  showFilter: false,
  filterName: "",
  page: 1,

  // Popups
  showAddPopup: false,
  showEditPopup: false,
  showDeletePopup: false,

  // Setters
  setSelectedAction: (action) => set({ selectedAction: action }),
  setCourseName: (val) => set({ courseName: val }),
  setCourseDescription: (val) => set({ courseDescription: val }),
  setSearchId: (val) => set({ searchId: val }),
  setShowFilter: (show) => set({ showFilter: show }),
  setFilterName: (val) => set({ filterName: val }),
  setPage: (page) => set({ page }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  setShowAddPopup: (show) => set({ showAddPopup: show }),
  setShowEditPopup: (show) => set({ showEditPopup: show }),
  setShowDeletePopup: (show) => set({ showDeletePopup: show }),

  clearForm: () => set({
    courseName: "",
    courseDescription: "",
    selectedCourse: null,
  }),

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const list = await fetchCoursesApi();
      set({ courses: list, isLoading: false });
    } catch (err) {
      console.error("fetchCourses error:", err);
      set({ courses: [], isLoading: false, error: err.message });
    }
  },

  addCourse: async () => {
    const data = {
      name: get().courseName,
      description: get().courseDescription,
    };

    const validation = validateWithZod(courseSchema, data);
    if (!validation.success) {
      alert(`Validation Error:\n${validation.errors}`);
      return false;
    }

    try {
      await createCourseApi(data);
      await get().fetchCourses();
      get().clearForm();
      set({ showAddPopup: false, selectedAction: "" });
      return true;
    } catch (err) {
      console.error("addCourse error:", err);
      alert("Failed to create course");
      return false;
    }
  },

  editCourse: async () => {
    const selected = get().selectedCourse;
    if (!selected) return false;

    const data = {
      name: get().courseName,
      description: get().courseDescription,
    };

    const validation = validateWithZod(courseSchema, data);
    if (!validation.success) {
      alert(`Validation Error:\n${validation.errors}`);
      return false;
    }

    try {
      await updateCourseApi(selected.id, data);
      await get().fetchCourses();
      get().clearForm();
      set({ showEditPopup: false, selectedAction: "" });
      alert("Course updated successfully!");
      return true;
    } catch (err) {
      console.error("editCourse error:", err);
      alert("Failed to update course");
      return false;
    }
  },

  deleteCourse: async (id) => {
    const targetId = id || get().selectedCourse?.id;
    try {
      await deleteCourseApi(targetId);
      await get().fetchCourses();
      set({ showDeletePopup: false, selectedCourse: null });
      return true;
    } catch (err) {
      console.error("deleteCourse error:", err);
      alert("Failed to delete course");
      return false;
    }
  },

  openEditForm: (course) => set({
    selectedCourse: course,
    courseName: course.name,
    courseDescription: course.description,
    showEditPopup: true,
  }),

  openDeleteConfirm: (course) => set({
    selectedCourse: course,
    showDeletePopup: true,
  }),
}));
