"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormInput from "./FormInput";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "@/store/authSlice";
import { toast } from "react-toastify";

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
  const dispatch = useDispatch();
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
        dispatch(setLoggedIn(true));
        router.replace("/");
      }
    } catch (error) {
      toast.error(`Login failed : ${error}`);
    }
  };

  const handleLogin = async (registration: string) => {
    const redirectUri = encodeURIComponent("http://localhost:3000/login");
    window.location.href = `${process.env.BASE_API_URL}oauth2/authorization/${registration}?redirectUri=${redirectUri}`;
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-lg btn-block btn-primary w-100 mb-3"
        style={{ backgroundColor: '#dd4b39' }}
        onClick={() => handleLogin('google')}
      >
        <i className="fab fa-google me-2"></i> Sign in with Google
      </button>

      <button
        type="button"
        className="btn btn-lg btn-block btn-primary w-100 mb-4"
        style={{ backgroundColor: '#3b5998' }}
        onClick={() => handleLogin('facebook')}
      >
        <i className="fab fa-facebook-f me-2"></i> Sign in with Facebook
      </button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <FormInput<LoginFormData>
            label="Email address or Username"
            type="text"
            name="usernameOrEmail"
            register={register}
            error={errors.usernameOrEmail?.message}
          />
        </div>
        <div className="mb-3">
          <FormInput<LoginFormData>
            label="Password"
            type="password"
            name="password"
            register={register}
            error={errors.password?.message}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>

  );
}
