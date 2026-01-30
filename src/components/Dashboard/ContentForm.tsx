'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Newsletter, Blog, CaseStudy, TiptapDoc } from '@/types';
import { formatDateForInput } from '@/lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import type { AxiosError } from 'axios';

interface ContentFormProps {
  onSubmit: (data: {
    title: string;
    subtitle: string;
    content: TiptapDoc;
    date: string;
    edition?: string;
    category?: string;
    status?: string;
  }) => Promise<void>;
  initialData?: Newsletter | Blog | CaseStudy | null;
  isLoading?: boolean;
  contentType: 'newsletter' | 'blog' | 'case-study';
  onCancel?: () => void;
  contentId?: string | null;
}

export function ContentForm({
  onSubmit,
  initialData,
  isLoading,
  contentType,
  onCancel,
  contentId,
}: ContentFormProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState<TiptapDoc>({ type: 'doc', content: [{ type: 'paragraph' }] });
  const [date, setDate] = useState('');
  const [edition, setEdition] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Refs for scroll-to-error functionality
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load initial data when editing
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSubtitle((initialData as Newsletter | Blog | CaseStudy).subtitle ?? '');
      setContent(initialData.content); // Content is required, no fallback needed
      setDate(formatDateForInput(initialData.date));
      setEdition(contentType === 'newsletter' ? (initialData as Newsletter).edition ?? '' : '');
      setCategory(contentType === 'case-study' ? (initialData as CaseStudy).category ?? '' : '');
      setStatus(initialData.status || 'DRAFT');
    } else {
      // Reset form for new item
      setTitle('');
      setSubtitle('');
      setContent({ type: 'doc', content: [{ type: 'paragraph' }] });
      setDate(formatDateForInput(new Date().toISOString()));
      setEdition('');
      setCategory('');
      setStatus('DRAFT');
    }
    setError('');
    setSuccess(false);
  }, [initialData, contentType]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation with scroll-to-error
    if (!title.trim()) {
      setError('Title is required');
      titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      titleRef.current?.focus();
      return;
    }

    if (!date) {
      setError('Date is required');
      dateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      dateRef.current?.focus();
      return;
    }

    // For now, rely on backend validation for the JSON doc.
    // UX: ensure a draft exists so inline image uploads can work.
    if (!contentId) {
      setError('Preparing editor... please try again in a moment.');
      return;
    }

    if (!content) {
      setError('Content is required');
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus the editor content area
      const editorContent = contentRef.current?.querySelector('[contenteditable="true"]') as HTMLElement;
      editorContent?.focus();
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        subtitle,
        content,
        date,
        edition: contentType === 'newsletter' ? (edition.trim() || undefined) : undefined,
        category: contentType === 'case-study' ? (category.trim() || undefined) : undefined,
        status,
      });

      setSuccess(true);
      
      // Only reset form if we're creating a new item, not editing
      if (!initialData) {
        setTitle('');
        setSubtitle('');
        setContent({ type: 'doc', content: [{ type: 'paragraph' }] });
        setDate(formatDateForInput(new Date().toISOString()));
        setEdition('');
        setCategory('');
        setStatus('DRAFT');
      }

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string }>;
      const errorMessage =
        axiosErr.response?.data?.error || 'Failed to save. Please try again.';
      setError(errorMessage);
    }
  };

  const contentTypeLabel = contentType.charAt(0).toUpperCase() + contentType.slice(1).replace('-', ' ');

  return (
    <div className="bg-white rounded-2xl border border-[#fcd5ac]">
      {/* Header with Title and Actions */}
      <div className="sticky top-0 z-10 px-8 py-6 border-b border-[#fcd5ac] bg-gradient-to-r from-white to-[#FFF6EB] shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0B1B2B]">
            {initialData ? 'Edit' : 'Create'} {contentTypeLabel}
          </h1>
          <div className="flex gap-3">
            <button
              type="submit"
              form="content-form"
              disabled={isLoading}
              className="bg-[#D9751E] hover:bg-[#c1651a] disabled:bg-[#d9a07a] text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[#0B1B2B] font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 border border-[#e0e0e0]"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-8 mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mx-8 mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-700 text-sm font-medium">
            {contentTypeLabel} saved successfully!
          </p>
        </div>
      )}

      {/* Form */}
      <form id="content-form" onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
            Title <span className="text-[#D9751E]">*</span>
          </label>
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E] focus:border-transparent text-[#0B1B2B] placeholder:text-[#3A4A5F] bg-white transition-all duration-200"
            placeholder="Enter title"
            disabled={isLoading}
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
            Subtitle <span className="text-[#3A4A5F] font-medium">(optional)</span>
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E] focus:border-transparent text-[#0B1B2B] placeholder:text-[#3A4A5F] bg-white transition-all duration-200"
            placeholder="Enter subtitle"
            disabled={isLoading}
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
            Date <span className="text-[#D9751E]">*</span>
          </label>
          <input
            ref={dateRef}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-48 px-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E] focus:border-transparent text-[#0B1B2B] bg-white transition-all duration-200"
            disabled={isLoading}
          />
        </div>

        {/* Edition / Category (optional) */}
        {contentType === 'newsletter' && (
          <div>
            <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
              Edition <span className="text-[#3A4A5F] font-medium">(optional)</span>
            </label>
            <input
              type="text"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              className="w-full px-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E] focus:border-transparent text-[#0B1B2B] placeholder:text-[#3A4A5F] bg-white transition-all duration-200"
              placeholder='e.g. "Edition 001"'
              disabled={isLoading}
            />
          </div>
        )}

        {contentType === 'case-study' && (
          <div>
            <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
              Category <span className="text-[#3A4A5F] font-medium">(optional)</span>
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E] focus:border-transparent text-[#0B1B2B] placeholder:text-[#3A4A5F] bg-white transition-all duration-200"
              placeholder='e.g. "IT & services"'
              disabled={isLoading}
            />
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
            Status <span className="text-[#D9751E]">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="DRAFT"
                checked={status === 'DRAFT'}
                onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
                disabled={isLoading}
                className="w-4 h-4 text-[#D9751E] focus:ring-2 focus:ring-[#D9751E]"
              />
              <span className="text-[#0B1B2B] font-medium">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="PUBLISHED"
                checked={status === 'PUBLISHED'}
                onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
                disabled={isLoading}
                className="w-4 h-4 text-[#D9751E] focus:ring-2 focus:ring-[#D9751E]"
              />
              <span className="text-[#0B1B2B] font-medium">Published</span>
            </label>
          </div>
        </div>

        {/* Content Editor */}
        <div ref={contentRef}>
          {contentId ? (
            <RichTextEditor
              content={content}
              onChange={setContent}
              disabled={isLoading}
              contentId={contentId}
              contentType={contentType}
            />
          ) : (
            <div className="w-full max-w-[1200px] border border-[#fcd5ac] rounded-2xl bg-gray-50 text-[#3A4A5F] px-6 py-10">
              Preparing editor…
            </div>
          )}
        </div>
      </form>
    </div>
  );
}