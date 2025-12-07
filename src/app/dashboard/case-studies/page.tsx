'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { ContentForm } from '@/components/Dashboard/ContentForm';
import { ContentTable } from '@/components/Dashboard/ContentTable';
import { CaseStudy } from '@/types';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';

export default function CaseStudiesPage() {
  const { isLoading: authLoading } = useProtectedRoute();
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch case studies
  const { data: caseStudies = [], isLoading } = useQuery({
    queryKey: ['case-studies'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.GET_CASE_STUDIES);
      return response.data.data;
    },
    enabled: !authLoading,
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; date: string }) => {
      if (editingId) {
        return api.put(API_ENDPOINTS.UPDATE_CASE_STUDY(editingId), data);
      } else {
        return api.post(API_ENDPOINTS.CREATE_CASE_STUDY, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] });
      setEditingId(null);
    },
  });

  // Delete mutation with optimistic update
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(API_ENDPOINTS.DELETE_CASE_STUDY(id)),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['case-studies'] });
      const previousCaseStudies = queryClient.getQueryData<CaseStudy[]>(['case-studies']);

      if (previousCaseStudies) {
        queryClient.setQueryData<CaseStudy[]>(['case-studies'], (old) =>
          old ? old.filter((item) => item.id !== id) : []
        );
      }

      return { previousCaseStudies };
    },
    onError: (err, id, context) => {
      if (context?.previousCaseStudies) {
        queryClient.setQueryData(['case-studies'], context.previousCaseStudies);
      }
      alert('Failed to delete case study');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] });
    },
  });

  const handleSubmit = async (data: { title: string; description: string; date: string }) => {
    await saveMutation.mutateAsync(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this case study?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (caseStudy: CaseStudy) => {
    setEditingId(caseStudy.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  const editingCaseStudy = editingId
    ? caseStudies.find((cs: CaseStudy) => cs.id === editingId)
    : null;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-black">Case Studies</h1>

      <ContentForm
        onSubmit={handleSubmit}
        initialData={editingCaseStudy || null}
        isLoading={saveMutation.isPending}
        contentType="case-study"
        onCancel={editingId ? handleCancel : undefined}
      />

      <ContentTable
        data={caseStudies}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending ? deleteMutation.variables : null}
        isLoading={isLoading}
        contentType="case-study"
      />
    </div>
  );
}