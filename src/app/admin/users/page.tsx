"use client";

import { useState } from "react";
import { FaSearch, FaEllipsisV, FaShieldAlt, FaEnvelope, FaCalendar, FaEye, FaBan, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface User {
  id: string;
  name: string;
  email: string;
  githubUsername: string;
  avatarUrl: string;
  reposCount: number;
  reviewsCount: number;
  status: "active" | "suspended";
  createdAt: number;
  lastActive: number;
}

const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "Mayank Sharma",
    email: "mayank@example.com",
    githubUsername: "MayankXDev13",
    avatarUrl: "",
    reposCount: 5,
    reviewsCount: 47,
    status: "active",
    createdAt: Date.now() - 2592000000,
    lastActive: Date.now() - 3600000,
  },
  {
    id: "user-2",
    name: "John Doe",
    email: "john@example.com",
    githubUsername: "johndoe",
    avatarUrl: "",
    reposCount: 3,
    reviewsCount: 23,
    status: "active",
    createdAt: Date.now() - 5184000000,
    lastActive: Date.now() - 86400000,
  },
  {
    id: "user-3",
    name: "Alice Smith",
    email: "alice@example.com",
    githubUsername: "alice",
    avatarUrl: "",
    reposCount: 8,
    reviewsCount: 89,
    status: "active",
    createdAt: Date.now() - 7776000000,
    lastActive: Date.now() - 7200000,
  },
  {
    id: "user-4",
    name: "Bob Wilson",
    email: "bob@example.com",
    githubUsername: "bobwilson",
    avatarUrl: "",
    reposCount: 1,
    reviewsCount: 5,
    status: "suspended",
    createdAt: Date.now() - 1296000000,
    lastActive: Date.now() - 604800000,
  },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "suspended">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.githubUsername.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLastActive = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(timestamp);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-600 mt-1">Manage registered users and their access</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FaSearch className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="font-medium text-gray-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">@{user.githubUsername}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {user.status === "active" ? (
                      <FaCheckCircle className="h-3 w-3" />
                    ) : (
                      <FaTimesCircle className="h-3 w-3" />
                    )}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.reposCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.reviewsCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatLastActive(user.lastActive)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-2 text-gray-600 hover:text-black transition-colors"
                      title="View Details"
                    >
                      <FaEye className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:text-black transition-colors"
                      title="More Actions"
                    >
                      <FaEllipsisV className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found matching your criteria
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <FaTimesCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-600">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                  <p className="text-gray-600">@{selectedUser.githubUsername}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                    <span>{selectedUser.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <FaShieldAlt className="h-4 w-4 text-gray-400" />
                    <span className="capitalize">{selectedUser.status}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Joined</label>
                  <div className="flex items-center gap-2 mt-1">
                    <FaCalendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(selectedUser.createdAt)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Activity</label>
                  <p className="mt-1">{selectedUser.reviewsCount} reviews</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {selectedUser.status === "active" ? (
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-700 rounded-md hover:bg-red-50 transition-colors">
                    <FaBan className="h-4 w-4" />
                    Suspend User
                  </button>
                ) : (
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-green-200 text-green-700 rounded-md hover:bg-green-50 transition-colors">
                    <FaCheckCircle className="h-4 w-4" />
                    Activate User
                  </button>
                )}
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <FaEnvelope className="h-4 w-4" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
