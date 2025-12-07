'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Newsletter, Blog, CaseStudy } from '@/types';
import { formatDate } from '@/lib/utils';

// Loading Skeleton Row
const TableRowSkeleton = () => (
  <tr className="border-b border-[#fcd5ac]">
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-3 w-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="px-6 py-4 text-right">
      <div className="flex justify-end gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </td>
  </tr>
);

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
      <div className="bg-white rounded-2xl border border-[#fcd5ac] overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-white to-[#FFF6EB] border-b border-[#fcd5ac]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#0B1B2B] uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#0B1B2B] uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#0B1B2B] uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#0B1B2B] uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-[#0B1B2B] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#fcd5ac] p-12 text-center">
        <p className="text-[#0B1B2B] text-lg font-semibold">No {contentType}s yet</p>
        <p className="text-[#3A4A5F] text-sm mt-2">
          Create your first {contentType} using the form below
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#fcd5ac] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-white to-[#FFF6EB] border-b border-[#fcd5ac]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#0B1B2B] uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#0B1B2B] uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#0B1B2B] uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#0B1B2B] uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-[#0B1B2B] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#fcd5ac]">
            {data.map((item, index) => (
              <tr
                key={item.id}
                className={`transition-colors duration-200 ${
                  index % 2 === 0 ? 'hover:bg-[#FFF6EB]' : 'hover:bg-[#FFFAF5]'
                }`}
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-[#0B1B2B]">{item.title}</p>
                </td>
                <td className="px-6 py-4 text-sm text-[#3A4A5F]">
                  {item.author.username}
                </td>
                <td className="px-6 py-4 text-sm text-[#3A4A5F]">
                  {formatDate(item.date)}
                </td>
                <td className="px-6 py-4 text-sm text-[#3A4A5F]">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-[#D9751E] hover:bg-[#FFE6D5] rounded-lg transition-colors duration-200 font-medium"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      disabled={isDeleting === item.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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