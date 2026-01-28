'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { ContentForm } from '@/components/Dashboard/ContentForm';
import { ContentTable } from '@/components/Dashboard/ContentTable';
import type { Blog, TiptapDoc } from '@/types';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { FileText } from 'lucide-react';
import Image from 'next/image';

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
  const [draftId, setDraftId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const createDraftMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(API_ENDPOINTS.CREATE_BLOG_DRAFT);
      return res.data?.data as Blog;
    },
    onSuccess: (draft) => {
      setDraftId(draft.id);
    },
  });

  // Fetch blogs (admin endpoint includes drafts + published)
  const {
    data: blogs = [],
    isLoading,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.GET_BLOGS_ADMIN);
      return response.data.data;
    },
    enabled: !authLoading,
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      content: TiptapDoc;
      date: string;
      status?: string;
    }) => {
      const id = editingId ?? draftId;
      if (!id) throw new Error('Draft not ready yet');

      const payload = {
        title: data.title,
        content: data.content,
        date: data.date,
        ...(data.status && { status: data.status }),
      };

      return await api.put(API_ENDPOINTS.UPDATE_BLOG(id), payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setEditingId(null);
      setDraftId(null);
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
    content: TiptapDoc;
    date: string;
    status?: string;
  }) => {
    await saveMutation.mutateAsync(data);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setDraftId(null);
    createDraftMutation.mutate();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setDraftId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = async () => {
    // If canceling a new draft (not editing existing), delete the draft
    if (draftId && !editingId) {
      try {
        await api.delete(API_ENDPOINTS.DELETE_BLOG(draftId));
      } catch (err) {
        console.error('Failed to delete draft:', err);
      }
    }
    setEditingId(null);
    setDraftId(null);
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#0B1B2B]">All Blogs</h2>
          <button
            onClick={handleCreateNew}
            disabled={createDraftMutation.isPending || editingId !== null || draftId !== null}
            className="bg-[#D9751E] hover:bg-[#c1651a] disabled:bg-[#d9a07a] text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed"
          >
            {createDraftMutation.isPending ? 'Creating...' : '+ Create New'}
          </button>
        </div>
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

      {/* Form Section - Only show when editing or creating */}
      {(editingId || draftId) && (
        <div>
          <ContentForm
            onSubmit={handleSubmit}
            initialData={editingBlog || null}
            isLoading={saveMutation.isPending}
            contentType="blog"
            onCancel={handleCancel}
            contentId={editingId ?? draftId}
          />
        </div>
      )}
    </div>
  );
}