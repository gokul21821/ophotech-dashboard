'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong!</h2>
      <p className="text-red-700 mb-4">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Try again
      </button>
    </div>
  );
}

