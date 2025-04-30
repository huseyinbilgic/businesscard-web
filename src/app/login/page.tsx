"use client";

import { useEffect, useState } from "react";
import "./login.module.css";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "@/store/authSlice";


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const { loading } = useRedirectIfAuthenticated();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('jwtToken');
    if (token) {
      localStorage.setItem('jwtToken', token);
      dispatch(setLoggedIn(true))
      router.replace('/');
      toast.success('Login succesfull')
    }

    const error = searchParams.get('error');
    if (error) {
      toast.error(error);
    }
  }, [dispatch, router, searchParams]);

  if (loading) {
    return <p>Yonlendiriliyor...</p>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light px-3">
      <div
        className="card shadow p-4 w-100"
        style={{ maxWidth: '400px', borderRadius: '20px' }}
      >
        <h3 className="text-center mb-4 text-primary">
          {isLogin ? 'Welcome Back!' : 'Join Us'}
        </h3>

        {isLogin ? <LoginForm /> : <RegisterForm setIsLogin={setIsLogin}/>}

        <div className="text-center mt-3">
          <small>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              className="btn btn-link p-0"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </small>
        </div>
      </div>
    </div>
  );
}