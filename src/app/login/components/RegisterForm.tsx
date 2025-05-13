"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormInput from "./FormInput";
import { registerUser } from "@/lib/auth";
import { toast } from "react-toastify";
import { Button, Form, Container } from "react-bootstrap";

type Props = {
  setIsLogin: (value: boolean) => void;
};


const schema = yup.object({
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

type RegisterFormData = yup.InferType<typeof schema>;

export default function RegisterForm({ setIsLogin }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const submitRegisterUser = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerUserRequest } = data;

    try {
      const resp = await registerUser(registerUserRequest);
      reset();
      setIsLogin(true);
      toast.success(resp as string);
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
        return;
      }
      for (const [key, value] of Object.entries(error as object)) {
        setError(key as keyof RegisterFormData, {
          type: "server",
          message: value.join(" \n "),
        });
      }
    }
  };

  return (
    <Container style={{ maxWidth: "500px" }}>
      <Form onSubmit={handleSubmit(submitRegisterUser)}>
        <FormInput
          label="Email address"
          type="email"
          name="email"
          register={register}
          error={errors.email}
          isInvalid={!!errors.email}
        />

        <FormInput
          label="Username"
          type="text"
          name="username"
          register={register}
          error={errors.username}
          isInvalid={!!errors.username}
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          register={register}
          error={errors.password}
          isInvalid={!!errors.password}
        />
        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword}
          isInvalid={!!errors.confirmPassword}
        />

        <Button type="submit" variant="primary" className="w-100">
          Register
        </Button>
      </Form>
    </Container>
  );
}
