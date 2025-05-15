"use client";

import React, { useState } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Download, 
  Search, 
  Filter, 
  CreditCard, 
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  Plus
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  type: 'membership' | 'session' | 'product';
  paymentMethod: string;
  invoice?: string;
}

export default function PaymentHistory() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const transactions: Transaction[] = [
    {
      id: 'INV-2025-001',
      date: '2025-05-01',
      description: 'Premium Membership - May 2025',
      amount: 99.99,
      status: 'completed',
      type: 'membership',
      paymentMethod: 'Credit Card (**** 1234)',
      invoice: 'INV-2025-001.pdf'
    },
    {
      id: 'INV-2025-002',
      date: '2025-05-08',
      description: 'Personal Training Session - with Mike Johnson',
      amount: 45.00,
      status: 'completed',
      type: 'session',
      paymentMethod: 'Credit Card (**** 1234)',
      invoice: 'INV-2025-002.pdf'
    },
    {
      id: 'INV-2025-003',
      date: '2025-05-15',
      description: 'Protein Supplements',
      amount: 29.99,
      status: 'pending',
      type: 'product',
      paymentMethod: 'PayPal'
    }
  ];

  const stats = {
    totalSpent: transactions.reduce((acc, t) => acc + t.amount, 0),
    monthlyMembership: 99.99,
    sessionsThisMonth: transactions.filter(t => 
      t.type === 'session' && 
      new Date(t.date).getMonth() === new Date().getMonth()
    ).length
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">Payment History</h1>
          <p className="text-gray-400">View and manage your payments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Payment Method
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Total Spent</div>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold text-white">
            ${stats.totalSpent.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400 mt-2">This Month</div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Monthly Membership</div>
            <CreditCard className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-semibold text-white">
            ${stats.monthlyMembership}
          </div>
          <div className="text-sm text-green-500 mt-2">Active</div>
        </div>

        <div className="bg-[#151C2C] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400">Training Sessions</div>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-semibold text-white">
            {stats.sessionsThisMonth}
          </div>
          <div className="text-sm text-gray-400 mt-2">This Month</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#151C2C] p-6 rounded-xl mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A2234] text-gray-400 rounded-lg hover:text-white transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilter ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilter && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Date Range</label>
                <select className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500">
                  <option value="">All Time</option>
                  <option value="1m">Last Month</option>
                  <option value="3m">Last 3 Months</option>
                  <option value="6m">Last 6 Months</option>
                  <option value="1y">Last Year</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Transaction Type</label>
                <select className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500">
                  <option value="">All Types</option>
                  <option value="membership">Membership</option>
                  <option value="session">Training Sessions</option>
                  <option value="product">Products</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Status</label>
                <select className="w-full px-4 py-2 bg-[#1A2234] text-white rounded-lg border border-gray-800 focus:outline-none focus:border-blue-500">
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-[#151C2C] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Payment Method</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-[#1A2234] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-white">
                      {new Date(transaction.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-white">${transaction.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transaction.status)}
                      <span className={getStatusColor(transaction.status)}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-400">{transaction.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {transaction.invoice && (
                      <button className="text-blue-500 hover:text-blue-400 flex items-center gap-1 ml-auto">
                        <Download className="w-4 h-4" />
                        Invoice
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing 1 to {transactions.length} of {transactions.length} entries
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded text-gray-400 hover:text-white disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 rounded text-gray-400 hover:text-white disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
