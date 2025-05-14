"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "./FormInput";
import { registerUser } from "@/lib/auth";
import { toast } from "react-toastify";
import { Button, Form, Container } from "react-bootstrap";
import { RegisterFormData, registerSchema } from "@/app/forms/form-data/RegisterFormData";
import { mapRegisterFormDataToRegisterUserRequest } from "@/app/mapper/UserMapper";

type Props = {
  setIsLogin: (value: boolean) => void;
};

export default function RegisterForm({ setIsLogin }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: "all",
    resolver: yupResolver(registerSchema),
  });

  const submitRegisterUser = async (data: RegisterFormData) => {
    const registerUserRequest = mapRegisterFormDataToRegisterUserRequest(data);

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
    <Container>
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
