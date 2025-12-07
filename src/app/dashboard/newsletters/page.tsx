'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { ContentForm } from '@/components/Dashboard/ContentForm';
import { ContentTable } from '@/components/Dashboard/ContentTable';
import { Newsletter } from '@/types';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';

export default function NewslettersPage() {
  const { isLoading: authLoading } = useProtectedRoute();
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch newsletters
  const { data: newsletters = [], isLoading } = useQuery({
    queryKey: ['newsletters'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.GET_NEWSLETTERS);
      return response.data.data;
    },
    enabled: !authLoading,
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; date: string }) => {
      if (editingId) {
        return api.put(API_ENDPOINTS.UPDATE_NEWSLETTER(editingId), data);
      } else {
        return api.post(API_ENDPOINTS.CREATE_NEWSLETTER, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletters'] });
      setEditingId(null);
    },
  });

  // Delete mutation with optimistic update
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(API_ENDPOINTS.DELETE_NEWSLETTER(id)),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['newsletters'] });
      const previousNewsletters = queryClient.getQueryData<Newsletter[]>(['newsletters']);
      
      if (previousNewsletters) {
        queryClient.setQueryData<Newsletter[]>(['newsletters'], (old) => 
          old ? old.filter((item) => item.id !== id) : []
        );
      }
      
      return { previousNewsletters };
    },
    onError: (err, id, context) => {
      if (context?.previousNewsletters) {
        queryClient.setQueryData(['newsletters'], context.previousNewsletters);
      }
      alert('Failed to delete newsletter');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletters'] });
    },
  });

  const handleSubmit = async (data: { title: string; description: string; date: string }) => {
    await saveMutation.mutateAsync(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this newsletter?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (newsletter: Newsletter) => {
    setEditingId(newsletter.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  const editingNewsletter = editingId
    ? newsletters.find((n: Newsletter) => n.id === editingId)
    : null;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-black">Newsletters</h1>

      <ContentForm
        onSubmit={handleSubmit}
        initialData={editingNewsletter || null}
        isLoading={saveMutation.isPending}
        contentType="newsletter"
        onCancel={editingId ? handleCancel : undefined}
      />

      <ContentTable
        data={newsletters}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending ? deleteMutation.variables : null}
        isLoading={isLoading}
        contentType="newsletter"
      />
    </div>
  );
}
