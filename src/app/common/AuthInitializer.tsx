import { AppDispatch } from "@/store";
import { setInitialized, setLoggedIn } from "@/store/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
  
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          dispatch(setLoggedIn(true));
        } else {
          dispatch(setLoggedIn(false));
        }
        dispatch(setInitialized(true)); 
      }, [dispatch]);
  
    return <>{children}</>;
  }