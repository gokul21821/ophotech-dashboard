'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { ContentForm } from '@/components/Dashboard/ContentForm';
import { ContentTable } from '@/components/Dashboard/ContentTable';
import { Blog } from '@/types';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';

export default function BlogsPage() {
  const { isLoading: authLoading } = useProtectedRoute();
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch blogs
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.GET_BLOGS);
      return response.data.data;
    },
    enabled: !authLoading,
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; date: string }) => {
      if (editingId) {
        return api.put(API_ENDPOINTS.UPDATE_BLOG(editingId), data);
      } else {
        return api.post(API_ENDPOINTS.CREATE_BLOG, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setEditingId(null);
    },
  });

  // Delete mutation with optimistic update
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(API_ENDPOINTS.DELETE_BLOG(id)),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['blogs'] });
      const previousBlogs = queryClient.getQueryData<Blog[]>(['blogs']);

      if (previousBlogs) {
        queryClient.setQueryData<Blog[]>(['blogs'], (old) =>
          old ? old.filter((item) => item.id !== id) : []
        );
      }

      return { previousBlogs };
    },
    onError: (err, id, context) => {
      if (context?.previousBlogs) {
        queryClient.setQueryData(['blogs'], context.previousBlogs);
      }
      alert('Failed to delete blog');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const handleSubmit = async (data: { title: string; description: string; date: string }) => {
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
    return <div>Loading...</div>;
  }

  const editingBlog = editingId
    ? blogs.find((b: Blog) => b.id === editingId)
    : null;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-black">Blogs</h1>

      <ContentForm
        onSubmit={handleSubmit}
        initialData={editingBlog || null}
        isLoading={saveMutation.isPending}
        contentType="blog"
        onCancel={editingId ? handleCancel : undefined}
      />

      <ContentTable
        data={blogs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending ? deleteMutation.variables : null}
        isLoading={isLoading}
        contentType="blog"
      />
    </div>
  );
}