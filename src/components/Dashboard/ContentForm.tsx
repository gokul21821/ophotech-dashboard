'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Newsletter, Blog, CaseStudy } from '@/types';
import { formatDateForInput } from '@/lib/utils';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import Image from 'next/image';

interface ContentFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    date: string;
    imageFile?: File | null;
    removeImage?: boolean;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  // Refs for scroll-to-error functionality
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setDate(formatDateForInput(initialData.date));
      setPreviewUrl(initialData.imageUrl || null);
      setImageFile(null);
      setRemoveImage(false);
    } else {
      // Reset form for new item
      setTitle('');
      setDescription('');
      setDate(formatDateForInput(new Date().toISOString()));
      setPreviewUrl(null);
      setImageFile(null);
      setRemoveImage(false);
    }
    setError('');
    setSuccess(false);
  }, [initialData]);

  const handleFileSelected = (file: File | undefined | null) => {
    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    setError('');
    setImageFile(file);
    setRemoveImage(false);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileSelected(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    handleFileSelected(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setRemoveImage(true);
  };

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

    if (!description.trim()) {
      setError('Description is required');
      descriptionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus the editor content area
      const editorContent = descriptionRef.current?.querySelector('[contenteditable="true"]') as HTMLElement;
      editorContent?.focus();
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        date,
        imageFile,
        removeImage,
      });

      setSuccess(true);
      setTitle('');
      setDescription('');
      setDate(formatDateForInput(new Date().toISOString()));
      setPreviewUrl(null);
      setImageFile(null);
      setRemoveImage(false);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to save. Please try again.';
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
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#D9751E] hover:bg-[#c1651a] disabled:bg-[#d9a07a] text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </button>

            {initialData && onCancel && (
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
      <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
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

        {/* Image upload */}
        <div>
          <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
            Image (optional)
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={handleFileDrop}
            className="relative rounded-xl border-2 border-dashed border-[#fcd5ac] bg-[#FFFAF5] px-4 py-5 transition-colors duration-200 hover:border-[#D9751E] hover:bg-[#FFF3E3]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[#fcd5ac] text-[#D9751E]">
                <Upload className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#0B1B2B]">
                  Drag & drop an image here, or{' '}
                  <label className="text-[#D9751E] hover:text-[#c1651a] cursor-pointer font-semibold">
                    browse
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isLoading}
                      className="sr-only"
                    />
                  </label>
                </p>
                <p className="text-xs text-[#3A4A5F] mt-1">Images only, max 5MB.</p>
              </div>
            </div>

            {previewUrl && (
              <div className="mt-4">
                <div className="relative h-36 w-64 overflow-hidden rounded-lg border border-[#fcd5ac]">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
              </div>
            )}
            {(previewUrl || initialData?.imageUrl) && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>
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

        {/* Description */}
        <div ref={descriptionRef}>
          <RichTextEditor content={description} onChange={setDescription} disabled={isLoading} />
        </div>
      </form>
    </div>
  );
}