import { z } from "zod";

export const batchSchema = z.object({
  batchName: z.string().min(2, "Batch name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  courseId: z.union([z.string(), z.number()]).optional(),
});
