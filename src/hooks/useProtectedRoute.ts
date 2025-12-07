'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

export function useProtectedRoute() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // User not authenticated, redirect to login
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isLoading, isAuthenticated };
}