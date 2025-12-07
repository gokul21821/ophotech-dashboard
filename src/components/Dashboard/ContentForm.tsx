'use client';

import React, { useState, useEffect } from 'react';
import { Newsletter, Blog, CaseStudy } from '@/types';
import { formatDateForInput } from '@/lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface ContentFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    date: string;
  }) => Promise<void>;
  initialData?: Newsletter | Blog | CaseStudy | null;
  isLoading?: boolean;
  contentType: 'newsletter' | 'blog' | 'case-study';
  onCancel?: () => void;
}

export function ContentForm({
  onSubmit,
  initialData,
  isLoading,
  contentType,
  onCancel,
}: ContentFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setDate(formatDateForInput(initialData.date));
    } else {
      // Reset form for new item
      setTitle('');
      setDescription('');
      setDate(formatDateForInput(new Date().toISOString()));
    }
    setError('');
    setSuccess(false);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    if (!date) {
      setError('Date is required');
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        date,
      });

      setSuccess(true);
      setTitle('');
      setDescription('');
      setDate(formatDateForInput(new Date().toISOString()));

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to save. Please try again.';
      setError(errorMessage);
    }
  };

  const contentTypeLabel = contentType.charAt(0).toUpperCase() + contentType.slice(1).replace('-', ' ');

  return (
    <div className="bg-white rounded-2xl border border-[#fcd5ac] p-8">
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-700 text-sm font-medium">
            {contentTypeLabel} saved successfully!
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
            Title <span className="text-[#D9751E]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E] focus:border-transparent text-[#0B1B2B] placeholder:text-[#3A4A5F] bg-white transition-all duration-200"
            placeholder="Enter title"
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
            Description <span className="text-[#D9751E]">*</span>
          </label>
          <RichTextEditor
            content={description}
            onChange={setDescription}
            disabled={isLoading}
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
            Date <span className="text-[#D9751E]">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E] focus:border-transparent text-[#0B1B2B] bg-white transition-all duration-200"
            disabled={isLoading}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[#D9751E] hover:bg-[#c1651a] disabled:bg-[#d9a07a] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </button>

          {initialData && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[#0B1B2B] font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 border border-[#e0e0e0]"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}