'use client';

import React from 'react';
import Link from 'next/link';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { Newspaper, FileText, BookOpen, LucideIcon } from 'lucide-react';
import Image from 'next/image';

// Types
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  count: number;
  href: string;
  isLoading: boolean;
}

// Loading Skeleton Component
const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-[#fcd5ac] p-6 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-[#FFE6D5]"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-8 w-16 bg-gray-200 rounded"></div>
        <div className="h-3 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title }) => (
  <div className="bg-white rounded-2xl border border-[#fcd5ac] p-12 text-center">
    <div className="flex justify-center mb-4">
      <div className="bg-[#FFE6D5] p-4 rounded-xl">
        <Icon size={32} className="text-[#D9751E]" />
      </div>
    </div>
    <h3 className="text-lg font-semibold text-[#0B1B2B] mb-2">{title}</h3>
  </div>
);

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, count, href, isLoading }) => {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  if (count === 0) {
    return (
      <EmptyState
        icon={Icon}
        title={`No ${label.toLowerCase()} yet`}
      />
    );
  }

  return (
    <Link href={href}>
      <div className="bg-white rounded-2xl border border-[#fcd5ac] p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full group">
        <div className="flex items-center gap-4">
          <div className="bg-[#FFE6D5] p-3 rounded-xl group-hover:bg-[#D9751E] transition-colors duration-200">
            <Icon
              size={24}
              className="text-[#D9751E] group-hover:text-white transition-colors duration-200"
            />
          </div>
          <div className="flex-1">
            <p className="text-[#3A4A5F] text-sm font-semibold">{label}</p>
            <p className="text-3xl font-medium text-[#0B1B2B] mt-1">{count}</p>
            <p className="text-[#3A4A5F] text-xs mt-2">
              Total {label.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9751E] mx-auto"></div>
          <p className="mt-4 text-[#3A4A5F]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Title */}
      <h1 className="text-4xl font-medium leading-[48px] text-[#0B1B2B] mb-8">
        Dashboard
      </h1>

      {/* Divider Line */}
      <div className="mb-12 flex justify-start">
        <Image
          src="/icons/horizontalline.svg"
          alt=""
          width={200}
          height={3}
          className="w-48"
          aria-hidden
        />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          icon={Newspaper}
          label="Newsletters"
          count={newsletters.length}
          href="/dashboard/newsletters"
          isLoading={newslettersLoading}
        />

        <StatCard
          icon={FileText}
          label="Blogs"
          count={blogs.length}
          href="/dashboard/blogs"
          isLoading={blogsLoading}
        />

        <StatCard
          icon={BookOpen}
          label="Case Studies"
          count={caseStudies.length}
          href="/dashboard/case-studies"
          isLoading={caseStudiesLoading}
        />
      </div>
    </div>
  );
}