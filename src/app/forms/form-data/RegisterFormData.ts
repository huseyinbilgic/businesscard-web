import * as yup from "yup";

export const registerSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email.")
    .max(255, "Must be at most 255 characters.")
    .matches(/^\S+$/, "Email cannot contain spaces!")
    .required("Email is required"),

  username: yup
    .string()
    .max(255, "Must be at most 255 characters.")
    .matches(/^\S+$/, "Username cannot contain spaces!")
    .required("Username is required"),

  password: yup
    .string()
    .matches(/^\S+$/, "Password cannot contain spaces!")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .matches(/^\S+$/, "Password cannot contain spaces!")
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
