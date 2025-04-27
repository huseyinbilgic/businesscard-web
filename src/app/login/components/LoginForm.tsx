"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormInput from "./FormInput";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";

type LoginFormData = {
  usernameOrEmail: string;
  password: string;
};

const schema = yup.object().shape({
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

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      if (response && response != '') {
        router.push("/");
      }
    } catch (error) {
      console.error("Kayıt başarısız:", error);
    }
  };

  const handleLogin = async (registration: string) => {
    const redirectUri = encodeURIComponent("http://localhost:3000/login");
    window.location.href = `${process.env.BASE_API_URL}oauth2/authorization/${registration}?redirectUri=${redirectUri}`;
  };

  return (
    <div>
      <button onClick={() => handleLogin("google")}>Login with Google</button>
      <button onClick={() => handleLogin("facebook")}>
        Login with Facebook
      </button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput<LoginFormData>
          label="Email address or Username"
          type="text"
          name="usernameOrEmail"
          register={register}
          error={errors.usernameOrEmail?.message}
        />
        <FormInput<LoginFormData>
          label="Password"
          type="password"
          name="password"
          register={register}
          error={errors.password?.message}
        />
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}
