import { apiClient } from "../lib/apiClient";

export const normalizeBatch = (raw) => {
  if (!raw) return null;
  return {
    id: raw.batch_id || raw.id || null,
    name: raw.batch_name || raw.name || raw.batchName || '',
    startDate: raw.start_date || raw.startDate || '',
    endDate: raw.end_date || raw.endDate || '',
    courseId: raw.course_id || raw.courseId || null,
    raw,
  };
};

export const fetchBatchesApi = async () => {
  const payload = await apiClient("/batch");
  const list = Array.isArray(payload) ? payload : (payload?.data || payload?.batches || []);
  return (list || []).map(normalizeBatch);
};

export const createBatchApi = async (batchData) => {
  const payload = {
    batch_name: batchData.batchName,
    start_date: batchData.startDate,
    end_date: batchData.endDate,
    course_id: batchData.courseId,
  };
  return await apiClient("/batch", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateBatchApi = async (id, batchData) => {
  const payload = {
    batch_name: batchData.batchName,
    start_date: batchData.startDate,
    end_date: batchData.endDate,
    course_id: batchData.courseId,
  };
  return await apiClient(`/batch/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const deleteBatchApi = async (id) => {
  return await apiClient(`/batch/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};
