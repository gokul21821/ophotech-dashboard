'use client';

import React from 'react';
import Link from 'next/link';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { Newspaper, FileText, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const { isLoading: authLoading } = useProtectedRoute();

  // Fetch stats for each content type
  const { data: newsletters = [], isLoading: newslettersLoading } = useQuery({
    queryKey: ['newsletters'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.GET_NEWSLETTERS);
      return response.data.data;
    },
    enabled: !authLoading,
  });

  const { data: blogs = [], isLoading: blogsLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.GET_BLOGS);
      return response.data.data;
    },
    enabled: !authLoading,
  });

  const { data: caseStudies = [], isLoading: caseStudiesLoading } = useQuery({
    queryKey: ['case-studies'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.GET_CASE_STUDIES);
      return response.data.data;
    },
    enabled: !authLoading,
  });

  const isLoading = newslettersLoading || blogsLoading || caseStudiesLoading;

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl text-black font-bold mb-8">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Newsletters card */}
        <Link href="/dashboard/newsletters">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Newspaper className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-semibold">Newsletters</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '--' : newsletters.length}
                </p>
                <p className="text-gray-500 text-xs mt-1">Total newsletters</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Blogs card */}
        <Link href="/dashboard/blogs">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-semibold">Blogs</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '--' : blogs.length}
                </p>
                <p className="text-gray-500 text-xs mt-1">Total blogs</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Case Studies card */}
        <Link href="/dashboard/case-studies">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-semibold">Case Studies</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '--' : caseStudies.length}
                </p>
                <p className="text-gray-500 text-xs mt-1">Total case studies</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}