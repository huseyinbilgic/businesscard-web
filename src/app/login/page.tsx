"use client";

import { useState } from "react";
import styles from "./login.module.css";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.toggle}>
            <button
              className={isLogin ? styles.active : ''}
              onClick={() => setIsLogin(true)}
            >
              Log in
            </button>
            <button
              className={!isLogin ? styles.active : ''}
              onClick={() => setIsLogin(false)}
            >
              Sign up
            </button>
          </div>
  
          <div className={styles.formContainer}>
            <div className={`${styles.slider} ${isLogin ? styles.showLogin : styles.showRegister}`}>
              <LoginForm />
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    );
}
