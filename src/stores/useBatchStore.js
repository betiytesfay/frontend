import { create } from "zustand";
import {
  fetchBatchesApi,
  createBatchApi,
  updateBatchApi,
  deleteBatchApi,
} from "../services/batchService";
import { batchSchema } from "../schemas/batchSchema";
import { validateWithZod } from "../lib/zodUtils";

export const useBatchStore = create((set, get) => ({
  batches: [],
  selectedBatch: null,
  selectedAction: "",
  isLoading: false,
  error: null,

  // Form fields
  batchName: "",
  startDate: "",
  endDate: "",
  courseId: "",

  // Search & Filter & Pagination
  searchId: "",
  showFilter: false,
  filterName: "",
  page: 1,

  // Modals
  showAddPopup: false,
  showEditPopup: false,
  showDeletePopup: false,

  // Setters
  setSelectedAction: (action) => set({ selectedAction: action }),
  setBatchName: (val) => set({ batchName: val }),
  setStartDate: (val) => set({ startDate: val }),
  setEndDate: (val) => set({ endDate: val }),
  setCourseId: (val) => set({ courseId: val }),
  setSearchId: (val) => set({ searchId: val }),
  setShowFilter: (show) => set({ showFilter: show }),
  setFilterName: (val) => set({ filterName: val }),
  setPage: (page) => set({ page }),
  setSelectedBatch: (batch) => set({ selectedBatch: batch }),
  setShowAddPopup: (show) => set({ showAddPopup: show }),
  setShowEditPopup: (show) => set({ showEditPopup: show }),
  setShowDeletePopup: (show) => set({ showDeletePopup: show }),

  clearForm: () => set({
    batchName: "",
    startDate: "",
    endDate: "",
    courseId: "",
    selectedBatch: null,
  }),

  fetchBatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const list = await fetchBatchesApi();
      set({ batches: list, isLoading: false });
    } catch (err) {
      console.error("fetchBatches error:", err);
      set({ batches: [], isLoading: false, error: err.message });
    }
  },

  addBatch: async () => {
    const data = {
      batchName: get().batchName,
      startDate: get().startDate,
      endDate: get().endDate,
      courseId: get().courseId,
    };

    const validation = validateWithZod(batchSchema, data);
    if (!validation.success) {
      alert(`Validation Error:\n${validation.errors}`);
      return false;
    }

    try {
      await createBatchApi(data);
      await get().fetchBatches();
      get().clearForm();
      set({ showAddPopup: false, selectedAction: "" });
      return true;
    } catch (err) {
      console.error("addBatch error:", err);
      alert("Failed to add batch");
      return false;
    }
  },

  editBatch: async () => {
    const selected = get().selectedBatch;
    if (!selected) return false;

    const data = {
      batchName: get().batchName,
      startDate: get().startDate,
      endDate: get().endDate,
      courseId: get().courseId,
    };

    const validation = validateWithZod(batchSchema, data);
    if (!validation.success) {
      alert(`Validation Error:\n${validation.errors}`);
      return false;
    }

    try {
      await updateBatchApi(selected.id, data);
      await get().fetchBatches();
      get().clearForm();
      set({ showEditPopup: false, selectedAction: "" });
      alert("Batch updated successfully!");
      return true;
    } catch (err) {
      console.error("editBatch error:", err);
      alert("Failed to update batch");
      return false;
    }
  },

  deleteBatch: async (id) => {
    const targetId = id || get().selectedBatch?.id;
    try {
      await deleteBatchApi(targetId);
      await get().fetchBatches();
      set({ showDeletePopup: false, selectedBatch: null });
      return true;
    } catch (err) {
      console.error("deleteBatch error:", err);
      alert("Failed to delete batch");
      return false;
    }
  },

  openEditForm: (batch) => set({
    selectedBatch: batch,
    batchName: batch.name,
    startDate: batch.startDate,
    endDate: batch.endDate,
    courseId: batch.courseId || "",
    showEditPopup: true,
  }),

  openDeleteConfirm: (batch) => set({
    selectedBatch: batch,
    showDeletePopup: true,
  }),
}));
