import z from "zod";

export const EmployeeSignupSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { error: "Please enter a valid first name" })
    .max(40, { error: "A name cannot exceed 40 characters" })
    .regex(/^[A-Za-z]+$/, { error: "Please enter a valid first name" }),
  lastName: z
    .string()
    .trim()
    .min(2, { error: "Please enter a valid last name" })
    .max(40, { error: "A name cannot exceed 40 characters" })
    .regex(/^[A-Za-z]+$/, { error: "Please enter a valid last name" }),
  username: z
    .string()
    .trim()
    .min(3, { error: "Username must have at least 3 characters" })
    .max(25, { error: "Username cannot exceed 25 characters" })
    .regex(/^(?=.*[a-zA-Z])[a-zA-Z0-9_]{3,}$/, {
      error: "Only letters, numbers, and underscores allowed. Must contain at least one letter",
    }),
  email: z
    .email("Please provide a valid email address")
    .trim()
    .lowercase()
    .min(6, "Please provide a valid email address")
    .max(50, { error: "Email address cannot exceed 50 characters" }),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    error:
      "Password must contain minimum 8 characters, uppercase and lowercase letters, a number, and a special character",
  }),
});

export const OrganizationSignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Please enter a valid first name" })
    .max(40, { error: "A name cannot exceed 40 characters" })
    .regex(/^[A-Za-z]+$/, { error: "Please enter a valid first name" }),
  username: z
    .string()
    .trim()
    .min(3, { error: "Username must have at least 3 characters" })
    .max(25, { error: "Username cannot exceed 25 characters" })
    .regex(/^(?=.*[a-zA-Z])[a-zA-Z0-9_]{3,}$/, {
      error: "Only letters, numbers, and underscores allowed. Must contain at least one letter",
    }),
  email: z
    .email("Please provide a valid email address")
    .trim()
    .lowercase()
    .min(6, "Please provide a valid email address")
    .max(50, { error: "Email address cannot exceed 50 characters" }),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    error:
      "Password must contain minimum 8 characters, uppercase and lowercase letters, a number, and a special character",
  }),
  postalCode: z
    .string()
    .trim()
    .max(20, "Postal code cannot exceed 20 characters")
    .regex(
      /^(?=.*[A-Za-z0-9])[A-Za-z0-9]+(?:[ -][A-Za-z0-9]+)*$/,
      "Please enter a valid postal code",
    ),
  city: z.string().trim().max(100, "A city name cannot exceed 100 characters"),
  country: z
    .string()
    .trim()
    .min(4, "Invalid country name")
    .max(32, "Only commonly used country names are allowed"),
});

export const LoginCredentialsSchema = z
  .object({
    email: z
      .email("Invalid credentials")
      .trim()
      .lowercase()
      .min(6, "Invalid credentials")
      .max(50, { error: "Invalid credentials" })
      .optional(),
    username: z
      .string()
      .trim()
      .min(3, { error: "Invalid credentials" })
      .max(25, { error: "Invalid credentials" })
      .regex(/^(?=.*[a-zA-Z])[a-zA-Z0-9_]{3,}$/, {
        error: "Invalid credentials",
      })
      .optional(),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
      error: "Invalid credentials",
    }),
  })
  .refine((data) => data.email || data.username, {
    error: "Invalid credentials",
  });
