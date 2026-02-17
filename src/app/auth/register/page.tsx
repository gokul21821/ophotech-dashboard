'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Public registration is disabled. User creation is admin-only via Dashboard > Manage Users.
 * Redirect to login.
 */
export default function RegisterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9751E] mx-auto"></div>
        <p className="mt-4 text-[#3A4A5F]">Redirecting...</p>
      </div>
    </div>
  );
}
