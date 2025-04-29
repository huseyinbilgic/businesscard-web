'use client'

import Link from "next/link";
import "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      const token = localStorage.getItem('jwtToken')
      if(token){
        setIsLoggedIn(true)
      }
      else{
        setIsLoggedIn(false)
      }
    }, []);

  const handleLoginLogout = async() => {
    if (isLoggedIn) {
      await logout();
      localStorage.removeItem('jwtToken')
      setIsLoggedIn(false);
    }
    else{
      router.push('/login');
    }
  };

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
          <div className="container">
            <Link href="/" className="navbar-brand">
              <h2>MyApp</h2>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link href="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/about" className="nav-link">
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleLoginLogout}
                  >
                    {isLoggedIn ? 'Logout' : 'Login'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mt-4">
        <div>
          <h1 className="text-center text-primary mb-4">Welcome to MyApp!</h1>
          <p className="text-center">
            This is a modern web app with a login/logout system.
          </p>
          <div className="d-flex justify-content-center mt-4">
            <button className="btn btn-primary">Start Here</button>
          </div>
        </div>
      </main>

      <footer className="bg-light py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0">© 2025 MyApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
