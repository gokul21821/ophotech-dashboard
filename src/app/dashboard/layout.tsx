'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { LogOut, LayoutDashboard, FileText, Newspaper, BookOpen } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { isAuthenticated } = useProtectedRoute();

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-6 overflow-y-auto">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">CMS Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your content</p>
        </div>

        {/* User info */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="font-semibold text-white">{user?.username}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/dashboard/newsletters"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Newspaper size={20} />
            <span>Newsletters</span>
          </Link>

          <Link
            href="/dashboard/blogs"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <FileText size={20} />
            <span>Blogs</span>
          </Link>

          <Link
            href="/dashboard/case-studies"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <BookOpen size={20} />
            <span>Case Studies</span>
          </Link>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition font-semibold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}