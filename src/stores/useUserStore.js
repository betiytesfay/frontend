import { create } from "zustand";
import {
  fetchUsersApi,
  fetchUserByIdApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from "../services/userService";
import { userSchema } from "../schemas/userSchema";
import { validateWithZod } from "../lib/zodUtils";

export const useUserStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  selectedUserId: null,
  selectedAction: "",
  isLoading: false,
  error: null,

  // Form Fields
  username: "",
  studentId: "",
  password: "",
  role: "admin",
  email: "",
  showPassword: false,

  // Filters & Pagination
  searchId: "",
  showFilter: false,
  isSearchActive: false,
  page: 1,
  pageSize: 10,

  // UI Popups
  showViewPopup: false,
  showEditPopup: false,
  showDeletePopup: false,

  // Actions & Setters
  setSelectedAction: (action) => set({ selectedAction: action }),
  setShowPassword: (show) => set({ showPassword: show }),
  setUsername: (val) => set({ username: val }),
  setStudentId: (val) => set({ studentId: val }),
  setPassword: (val) => set({ password: val }),
  setRole: (val) => set({ role: val }),
  setEmail: (val) => set({ email: val }),
  setSearchId: (val) => set({ searchId: val }),
  setShowFilter: (show) => set({ showFilter: show }),
  setIsSearchActive: (active) => set({ isSearchActive: active }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize }),
  setShowViewPopup: (show) => set({ showViewPopup: show }),
  setShowEditPopup: (show) => set({ showEditPopup: show }),
  setShowDeletePopup: (show) => set({ showDeletePopup: show }),
  setSelectedUserId: (id) => set({ selectedUserId: id }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  clearForm: () => set({
    username: "",
    studentId: "",
    password: "",
    role: "admin",
    email: "",
    selectedUserId: null,
    selectedUser: null,
  }),

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const usersList = await fetchUsersApi();
      set({ users: usersList, isLoading: false });
    } catch (err) {
      console.error("fetchUsers failed", err);
      set({ users: [], isLoading: false, error: err.message });
    }
  },

  fetchUserById: async (id) => {
    try {
      const user = await fetchUserByIdApi(id || get().searchId);
      if (user) {
        set({ users: [user] });
      }
    } catch (err) {
      console.error("fetchUserById failed", err);
    }
  },

  addUser: async () => {
    const formData = {
      firstName: get().username.split(" ")[0] || get().username,
      lastName: get().username.split(" ")[1] || "N/A",
      username: get().username,
      studentId: get().studentId,
      password: get().password,
      role: get().role,
      email: get().email,
    };

    const validation = validateWithZod(userSchema, formData);
    if (!validation.success) {
      alert(`Validation Error:\n${validation.errors}`);
      return false;
    }

    try {
      await createUserApi(formData);
      await get().fetchUsers();
      get().clearForm();
      set({ selectedAction: "" });
      return true;
    } catch (err) {
      console.error("addUser failed", err);
      alert("Failed to add user");
      return false;
    }
  },

  editUser: async () => {
    const formData = {
      username: get().username,
      studentId: get().studentId,
      password: get().password,
      email: get().email,
    };

    try {
      await updateUserApi(formData);
      await get().fetchUsers();
      get().clearForm();
      set({ selectedAction: "", showEditPopup: false });
      alert("User updated successfully!");
      return true;
    } catch (err) {
      console.error("editUser failed", err);
      alert("Failed to edit user");
      return false;
    }
  },

  deleteUser: async (id) => {
    try {
      await deleteUserApi(id || get().selectedUserId);
      await get().fetchUsers();
      set({ showDeletePopup: false, selectedUserId: null });
      return true;
    } catch (err) {
      console.error("deleteUser failed", err);
      alert("Failed to delete user");
      return false;
    }
  },

  openEditForm: (user) => set({
    selectedUserId: user.user_id,
    selectedUser: user,
    username: user.username,
    studentId: user.student_id || "",
    email: user.email,
    role: user.role,
    selectedAction: "edit",
    showEditPopup: true,
  }),

  openDeleteConfirm: (user) => set({
    selectedUserId: user.user_id,
    selectedUser: user,
    showDeletePopup: true,
  }),

  openViewPopup: (user) => set({
    selectedUserId: user.user_id,
    selectedUser: user,
    showViewPopup: true,
  }),
}));
