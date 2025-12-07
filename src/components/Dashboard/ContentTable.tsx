'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Newsletter, Blog, CaseStudy } from '@/types';
import { formatDate } from '@/lib/utils';

// Utility function to strip HTML tags and get plain text
const stripHtmlTags = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

interface ContentTableProps {
  data: (Newsletter | Blog | CaseStudy)[];
  onEdit: (item: Newsletter | Blog | CaseStudy) => void;
  onDelete: (id: string) => void;
  isDeleting?: string | null;
  isLoading?: boolean;
  contentType: 'newsletter' | 'blog' | 'case-study';
}

export function ContentTable({
  data,
  onEdit,
  onDelete,
  isDeleting,
  isLoading,
  contentType,
}: ContentTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-black">Loading {contentType}s...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden p-8 text-center">
        <p className="text-gray-500 text-lg">No {contentType}s yet</p>
        <p className="text-gray-400 text-sm mt-2">Create your first {contentType} using the form above</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {stripHtmlTags(item.description)}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-black">
                  {item.author.username}
                </td>
                <td className="px-6 py-4 text-sm text-black">
                  {formatDate(item.date)}
                </td>
                <td className="px-6 py-4 text-sm text-black">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      disabled={isDeleting === item.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}