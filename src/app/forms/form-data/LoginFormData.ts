import * as yup from "yup";

export const loginSchema = yup.object({
  usernameOrEmail: yup
    .string()
    .max(255, "Must be at most 255 characters.")
    .matches(/^\S+$/, "Username or email cannot contain spaces!")
    .required("Username or email is required"),

  password: yup
    .string()
    .matches(/^\S+$/, "Password cannot contain spaces!")
    .required("Password is required."),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
