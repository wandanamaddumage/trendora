import * as z from "zod"

export const signupSchema = z
  .object({
    fname: z.string().min(2, "First name is required"),
    lname: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    contact: z.string().min(10, "Contact number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export type SignupFormValues = z.infer<typeof signupSchema>
