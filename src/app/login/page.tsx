"use client";

import { useState } from "react";
import  "./login.module.css";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '20px' }}>
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
