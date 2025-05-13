"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormInput from "./FormInput";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Form, Container } from "react-bootstrap";

const schema = yup.object({
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
type LoginFormData = yup.InferType<typeof schema>;

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode:'all',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      router.replace("/");
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
        return;
      }
      for (const [key, value] of Object.entries(error as object)) {
        setError(key as keyof LoginFormData, {
          type: "server",
          message: value.join(" \n "),
        });
      }
    }
  };

  const handleLogin = (provider: string) => {
    const redirectUri = encodeURIComponent("http://localhost:3000/login");
    window.location.href = `${process.env.BASE_API_URL}oauth2/authorization/${provider}?redirectUri=${redirectUri}`;
  };

  return (
    <Container style={{ maxWidth: "500px" }}>
      <Button
        variant="danger"
        className="w-100 mb-3"
        size="lg"
        onClick={() => handleLogin("google")}
      >
        <i className="fab fa-google me-2"></i> Sign in with Google
      </Button>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email address or Username"
          type="text"
          name="usernameOrEmail"
          register={register}
          error={errors.usernameOrEmail}
          isInvalid={!!errors.usernameOrEmail}
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          register={register}
          error={errors.password}
          isInvalid={!!errors.password}
        />

        <Button type="submit" variant="primary" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  );
}
