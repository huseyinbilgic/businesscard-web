'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useRedirectIfAuthenticated = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            router.replace('/');
        } else {
            setLoading(false);
        }
    }, []);
    return { loading };
};