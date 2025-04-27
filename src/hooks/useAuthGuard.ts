'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useAuthGuard = (): { loading: boolean } => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  return { loading };
};