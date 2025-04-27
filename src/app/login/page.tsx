"use client";

import { useEffect, useState } from "react";
import "./login.module.css";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const { loading } = useRedirectIfAuthenticated();

  useEffect(() => {
    const token = searchParams.get('jwtToken');
    if (token) {
      localStorage.setItem('jwtToken', token);
      router.replace('/');

    }
  }, [router, searchParams]);

  if (loading) {
    return <p>Yonlendiriliyor...</p>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: '100%', maxWidth: '400px', borderRadius: '20px' }}
      >
        <h3 className="text-center mb-4 text-primary">
          {isLogin ? 'Welcome Back!' : 'Join Us'}
        </h3>
        {isLogin ? <LoginForm /> : <RegisterForm />}
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