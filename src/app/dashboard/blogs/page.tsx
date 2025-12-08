'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { ContentForm } from '@/components/Dashboard/ContentForm';
import { ContentTable } from '@/components/Dashboard/ContentTable';
import { Blog } from '@/types';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { FileText } from 'lucide-react';
import Image from 'next/image';
import { deleteContentImage, uploadContentImage } from '@/lib/uploads';

// Loading Skeleton for Table
const TableSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-white rounded-2xl border border-[#fcd5ac] p-6 animate-pulse">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="h-3 w-96 bg-gray-200 rounded"></div>
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Empty State Component
const EmptyTableState = () => (
  <div className="bg-white rounded-2xl border border-[#fcd5ac] p-12 text-center">
    <div className="flex justify-center mb-4">
      <div className="bg-[#FFE6D5] p-4 rounded-xl">
        <FileText size={32} className="text-[#D9751E]" />
      </div>
    </div>
    <h3 className="text-lg font-semibold text-[#0B1B2B] mb-2">
      No blogs yet
    </h3>
    <p className="text-[#3A4A5F] max-w-md mx-auto">
      Create your first blog using the form below to get started
    </p>
  </div>
);

export default function BlogsPage() {
  const { isLoading: authLoading } = useProtectedRoute();
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch blogs
  const {
    data: blogs = [],
    isLoading,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.GET_BLOGS);
      return response.data.data;
    },
    enabled: !authLoading,
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      date: string;
      imageFile?: File | null;
      removeImage?: boolean;
    }) => {
      const payload = {
        title: data.title,
        description: data.description,
        date: data.date,
      };

      const res = editingId
        ? await api.put(API_ENDPOINTS.UPDATE_BLOG(editingId), payload)
        : await api.post(API_ENDPOINTS.CREATE_BLOG, payload);

      const id = editingId || res.data?.data?.id;

      if (id && data.removeImage) {
        await deleteContentImage('blog', id);
      }
      if (id && data.imageFile) {
        await uploadContentImage('blog', id, data.imageFile);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setEditingId(null);
    },
  });

  // Delete mutation with optimistic update
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.delete(API_ENDPOINTS.DELETE_BLOG(id)),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['blogs'] });
      const previousBlogs =
        queryClient.getQueryData<Blog[]>(['blogs']);

      if (previousBlogs) {
        queryClient.setQueryData<Blog[]>(
          ['blogs'],
          (old) =>
            (old ? old.filter((item) => item.id !== id) : [])
        );
      }

      return { previousBlogs };
    },
    onError: (err, id, context) => {
      if (context?.previousBlogs) {
        queryClient.setQueryData(
          ['blogs'],
          context.previousBlogs
        );
      }
      alert('Failed to delete blog');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const handleSubmit = async (data: {
    title: string;
    description: string;
    date: string;
    imageFile?: File | null;
    removeImage?: boolean;
  }) => {
    await saveMutation.mutateAsync(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingId(blog.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9751E] mx-auto"></div>
          <p className="mt-4 text-[#3A4A5F]">Loading blogs...</p>
        </div>
      </div>
    );
  }

  const editingBlog = editingId
    ? blogs.find((b: Blog) => b.id === editingId)
    : null;

  return (
    <div>
      {/* Page Title */}
      <h1 className="text-4xl font-medium leading-[48px] text-[#0B1B2B] mb-8">
        Blogs
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

      {/* Table Section */}
      <div className="mb-16">
        {isLoading ? (
          <TableSkeleton />
        ) : blogs.length === 0 ? (
          <EmptyTableState />
        ) : (
          <ContentTable
            data={blogs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={
              deleteMutation.isPending ? deleteMutation.variables : null
            }
            isLoading={isLoading}
            contentType="blog"
          />
        )}
      </div>

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

      {/* Form Section */}
      <div>
        <ContentForm
          onSubmit={handleSubmit}
          initialData={editingBlog || null}
          isLoading={saveMutation.isPending}
          contentType="blog"
          onCancel={editingId ? handleCancel : undefined}
        />
      </div>
    </div>
  );
}