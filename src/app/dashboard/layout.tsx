'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { LogOut, LayoutDashboard, FileText, Newspaper, BookOpen, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { isAuthenticated } = useProtectedRoute();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9751E] mx-auto"></div>
          <p className="mt-4 text-[#3A4A5F]">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { href: '/dashboard/newsletters', icon: Newspaper, label: 'Newsletters' },
    { href: '/dashboard/blogs', icon: FileText, label: 'Blogs' },
    { href: '/dashboard/case-studies', icon: BookOpen, label: 'Case Studies' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#0B1B2B] text-white p-6 overflow-y-auto transition-all duration-300 ease-in-out z-50 ${
          sidebarOpen ? 'w-64' : 'w-24'
        }`}
      >
        {/* Logo and Close Button */}
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen && (
            <div className="flex-1">
              <Image
                src="/icons/logo.svg"
                alt="Logo"
                width={160}
                height={32}
                priority
              />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#1a2a3a] rounded-lg transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              size={20}
              className={`transition-transform duration-300 ${
                !sidebarOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>


        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#D9751E] transition-colors duration-200 group"
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon
                  size={20}
                  className="text-[#D9751E] group-hover:text-white transition-colors duration-200"
                />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info and Logout button */}
        <div
          className={`absolute bottom-6 left-6 right-6 transition-all duration-300 ${
            sidebarOpen ? 'w-auto' : 'w-12'
          }`}
        >
          {sidebarOpen && (
            <div className="bg-[#1a2a3a] rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="font-semibold text-white mt-1">{user?.username}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-[#D9751E] hover:bg-[#c1651a] rounded-lg transition-colors duration-200 font-semibold"
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-24'
        }`}
      >
        <div className="p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}