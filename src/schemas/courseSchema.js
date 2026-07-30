import { z } from "zod";

export const courseSchema = z.object({
  name: z.string().min(2, "Course name must be at least 2 characters"),
  description: z.string().optional(),
});
