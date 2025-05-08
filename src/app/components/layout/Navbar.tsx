'use client';

import { logout } from "@/lib/auth";
import { RootState } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Navbar() {
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const [hydrated, setHydrated] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setHydrated(true);
    }, []);

    const handleLoginLogout = async () => {
        if (isLoggedIn) {
            await logout();
            router.replace('/');
        }
        else {
            router.push('/login');
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container">
                <Link href="/" className="navbar-brand">
                    <Image
                        src="/business-card-logo.png"
                        alt="Business Card Logo"
                        width={100}
                        height={100}
                        priority
                    />
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
                        {
                            isLoggedIn ? <li className="nav-item">
                                <Link href="/profile" className="nav-link">
                                    Profile
                                </Link>
                            </li> : null
                        }

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

                        {
                            hydrated ?
                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={handleLoginLogout}
                                    >
                                        {isLoggedIn ? 'Logout' : 'Login'}
                                    </button>
                                </li> : null
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
}