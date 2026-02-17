'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { RoleGuard } from '@/components/auth/RoleGuard';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { User as UserType } from '@/types';
import {
  Users as UsersIcon,
  UserPlus,
  Trash2,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import Image from 'next/image';

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default function UsersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLoading: authLoading } = useProtectedRoute();
  const { createUser, user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'USER'>('USER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: UserType[] }>(API_ENDPOINTS.GET_USERS);
      return response.data.data;
    },
    enabled: !authLoading && user?.role === 'ADMIN',
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowCreateForm(false);
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setRole('USER');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(API_ENDPOINTS.DELETE_USER(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !username || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        email,
        username,
        password,
        confirmPassword,
        role,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create user');
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <RoleGuard
      allowedRoles={['ADMIN']}
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#0B1B2B] text-lg font-semibold">Access denied</p>
            <p className="text-[#3A4A5F] mt-2">You do not have permission to manage users.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 px-6 py-2 bg-[#D9751E] text-white rounded-xl hover:bg-[#c1651a] font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      }
    >
      <div>
        <h1 className="text-4xl font-medium leading-[48px] text-[#0B1B2B]">
          Manage Users
        </h1>

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

        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700 text-sm font-medium">User created successfully!</p>
          </div>
        )}

        {/* Create User section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#0B1B2B]">All Users</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-[#D9751E] hover:bg-[#c1651a] text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <UserPlus size={20} />
              {showCreateForm ? 'Cancel' : 'Create User'}
            </button>
          </div>

          {showCreateForm && (
            <div className="bg-white rounded-2xl border border-[#fcd5ac] p-8 mb-8">
              <h3 className="text-lg font-semibold text-[#0B1B2B] mb-6">Create New User</h3>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
              <form onSubmit={handleCreateUser} className="space-y-5 max-w-md">
                <div>
                  <label className="block text-sm font-semibold text-[#0B1B2B] mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-[#D9751E]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E]"
                      placeholder="user@example.com"
                      disabled={createUserMutation.isPending}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1B2B] mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-[#D9751E]" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E]"
                      placeholder="johndoe"
                      disabled={createUserMutation.isPending}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1B2B] mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[#D9751E]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E]"
                      placeholder="••••••••"
                      disabled={createUserMutation.isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-[#3A4A5F] hover:text-[#D9751E]"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1B2B] mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[#D9751E]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E]"
                      placeholder="••••••••"
                      disabled={createUserMutation.isPending}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1B2B] mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'ADMIN' | 'USER')}
                    className="w-full px-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E]"
                    disabled={createUserMutation.isPending}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="bg-[#D9751E] hover:bg-[#c1651a] disabled:bg-[#d9a07a] text-white font-semibold py-2.5 px-6 rounded-xl"
                >
                  {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                </button>
              </form>
            </div>
          )}

          {/* Users table */}
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-[#fcd5ac] p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9751E] mx-auto"></div>
              <p className="mt-4 text-[#3A4A5F]">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#fcd5ac] p-12 text-center">
              <UsersIcon size={48} className="mx-auto text-[#D9751E] mb-4" />
              <p className="text-[#0B1B2B] text-lg font-semibold">No users yet</p>
              <p className="text-[#3A4A5F] mt-2">Create your first user using the form above</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#fcd5ac] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-white to-[#FFF6EB] border-b border-[#fcd5ac]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#0B1B2B] uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#0B1B2B] uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#0B1B2B] uppercase tracking-wider">
                        Role
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
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#FFF6EB] transition-colors">
                        <td className="px-6 py-4 text-sm text-[#3A4A5F]">{u.email}</td>
                        <td className="px-6 py-4 font-medium text-[#0B1B2B]">{u.username}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              u.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#3A4A5F]">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(u.id, u.username)}
                            disabled={deleteMutation.isPending}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete user"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
