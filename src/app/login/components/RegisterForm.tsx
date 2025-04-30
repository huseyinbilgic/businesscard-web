"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormInput from "./FormInput";
import { registerUser } from "@/lib/auth";
import { toast } from "react-toastify";

type Props = {
  setIsLogin: (value: boolean) => void;
};

type RegisterFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object().shape({
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

export default function RegisterForm({ setIsLogin }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const submitRegisterUser = async (data: RegisterFormData) => {
    const {
      confirmPassword,
      ...registerUserRequest
    }: RegisterFormData & { confirmPassword: string } = data;
    try {
      const response = await registerUser(registerUserRequest);
      reset();
      setIsLogin(true);
      toast.success("Register successfull:", response);
    } catch (error) {
      toast.error(`Register failed: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitRegisterUser)}>
      <div className="mb-3">
        <FormInput<RegisterFormData>
          label="Email address"
          type="email"
          name="email"
          register={register}
          error={errors.email?.message}
        />
      </div>
      <div className="mb-3">
        <FormInput<RegisterFormData>
          label="Username"
          type="text"
          name="username"
          register={register}
          error={errors.username?.message}
        />
      </div>
      <div className="mb-3">
        <FormInput<RegisterFormData>
          label="Password"
          type="password"
          name="password"
          register={register}
          error={errors.password?.message}
        />
      </div>
      <div className="mb-3">
        <FormInput<RegisterFormData>
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword?.message}
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        Register
      </button>
    </form>
  );
}
