import z from "zod";

const usernameSchema = z
  .string()
  .trim()
  .min(3, { error: "Too short. Minimum 3 characters expected" })
  .max(25, { error: "Username cannot exceed 25 characters" })
  .regex(/^(?=.*[a-zA-Z])[a-zA-Z0-9_]{3,}$/, {
    error: "Only letters, numbers, and underscores allowed. At least one letter expected",
  });

const emailSchema = z
  .email("Please provide a valid email address")
  .trim()
  .lowercase()
  .min(6, "Please provide a valid email address")
  .max(50, { error: "Email address cannot exceed 50 characters" });

const passwordSchema = z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
  error:
    "Password must contain: minimum 8 characters, uppercase & lowercase letters, number, special character/s",
});

export const employeeSignupSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { error: "Too short. Minimum 2 letters expected" })
    .max(40, { error: "First name cannot exceed 40 characters" })
    .regex(/^[A-Za-z]+$/, { error: "Please enter a valid first name (only letters)" }),
  lastName: z
    .string()
    .trim()
    .min(2, { error: "Too short. Minimum 2 letters expected" })
    .max(40, { error: "Last name cannot exceed 40 characters" })
    .regex(/^[A-Za-z]+(?:'[A-Za-z]+)?$/, {
      error: "Please enter a valid last name (only letters)",
    }),
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});
export type EmployeeSignupData = z.infer<typeof employeeSignupSchema>;

export const workplaceSignupSchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(2, { error: "Too short. Minimum 2 letters expected" })
    .max(40, { error: "Name cannot exceed 40 characters" })
    .regex(/^(?=.*[A-Za-z])[A-Za-z0-9](?:[A-Za-z0-9]|[.'-](?=[A-Za-z0-9]))*$/, {
      error: "Please enter a valid organization name",
    }),
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
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
    .max(32, "Please provide the commonly used or shortened name of your country"),
});
export type WorkplaceSignupData = z.infer<typeof workplaceSignupSchema>;

export const signupRequestSchema = z.object({
  body: z.union([employeeSignupSchema, workplaceSignupSchema]),
});
export type SignupData = z.infer<typeof signupRequestSchema>;

export const loginCredentialsSchema = z.object({
  body: z
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
    }),
});
export type LoginCredentialsInput = z.infer<typeof loginCredentialsSchema>;
