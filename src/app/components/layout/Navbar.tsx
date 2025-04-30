'use client';
import { logout } from "@/lib/auth";
import { RootState } from "@/store";
import { setLoggedIn } from "@/store/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const dispatch = useDispatch();

    const router = useRouter();

    const handleLoginLogout = async () => {
        if (isLoggedIn) {
            await logout();
            dispatch(setLoggedIn(false));
        }
        else {
            router.push('/login');
        }
    };
    
    return (
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
    );

}