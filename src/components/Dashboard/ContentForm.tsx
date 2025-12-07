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

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl text-black font-bold mb-6">
        {initialData ? `Edit ${contentType}` : `Add New ${contentType}`}
      </h2>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-700 text-sm">
            {contentType.charAt(0).toUpperCase() + contentType.slice(1)} saved successfully!
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500"
            placeholder="Enter title"
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Description *
          </label>
          <RichTextEditor
            content={description}
            onChange={setDescription}
            disabled={isLoading}
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Date *
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            disabled={isLoading}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </button>

          {initialData && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}