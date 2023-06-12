import { z } from "zod";

export const itemValidationSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(25, { message: "Title is too long." }),
  start: z.coerce.date().min(new Date(), {
    message: "Date must be in future",
  }),
  deadline: z.coerce.date().min(new Date(), {
    message: "Date must be in future",
  }),
  text: z.string().min(1, { message: "Note is required" }),
  completed: z.boolean(),
});

export type ItemValidation = z.infer<typeof itemValidationSchema>;

export const listValidationSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(25, { message: "Title is too long." }),
  createdAt: z.coerce.date().min(new Date()),
});

export type ListValidation = z.infer<typeof listValidationSchema>;
