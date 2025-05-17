"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Loader, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import EditGymModal from './components/edit-gym-modal';
import StatusActionButtons from '../components/status-action-buttons';
import StatusHelpModal from '../components/status-help-modal';
import StatusLegend from '../components/status-legend';

// This is the API/Database Gym interface
interface GymData {
  _id: string;
  gymName: string;
  ownerName: string;
  address: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  role: string;
}

// This is the interface used by the modal components
interface Gym {
  id: number;
  name: string;
  owner: string;
  location: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function GymManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [gyms, setGyms] = useState<GymData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStatusHelpOpen, setIsStatusHelpOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Stores gym ID during action
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  
  // Fetch gyms from API
  useEffect(() => {
    fetchGyms();
  }, [pagination.page, statusFilter, searchQuery]);
  
  const fetchGyms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());
      
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter);
      }
      
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      // Fetch data from API
      console.log(`Fetching gyms with parameters: ${queryParams.toString()}`);
      const response = await fetch(`/api/admin/gyms?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch gyms');
      }
      
      const data = await response.json();
      console.log('Fetched gyms data:', data);
      setGyms(data.gyms);
      setPagination(data.pagination);
      setLastRefreshed(new Date());
      
    } catch (err: any) {
      console.error('Error fetching gyms:', err);
      setError(err.message || 'An error occurred while fetching gyms');
      // Reset gyms and pagination on error
      setGyms([]);
      setPagination({
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (gymId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    setActionLoading(gymId);
    
    try {
      const response = await fetch('/api/admin/gyms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gymId, status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update gym status');
      }
      
      // Update local state
      const updatedGyms = gyms.map(gym => 
        gym._id === gymId ? { ...gym, status: newStatus } : gym
      );
      
      setGyms(updatedGyms);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating status');
    } finally {
      setActionLoading(null);
    }
  };
  
  // Handle delete gym
  const handleDeleteGym = async (gymId: string) => {
    setActionLoading(gymId);
    
    try {
      const response = await fetch(`/api/admin/gyms?id=${gymId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete gym');
      }
      
      // Remove from local state
      setGyms(gyms.filter(gym => gym._id !== gymId));
      setShowDeleteConfirm(null);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting gym');
    } finally {
      setActionLoading(null);
    }
  };
  
  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get status badge style
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Pagination navigation
  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination({ ...pagination, page: pagination.page - 1 });
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.pages) {
      setPagination({ ...pagination, page: pagination.page + 1 });
    }
  };

  // Convert from GymData to Gym (for modal compatibility)
  const convertToOldGymFormat = (gymData: GymData): Gym => {
    return {
      id: parseInt(gymData._id.substring(gymData._id.length - 6), 16) || 1, // Convert last 6 chars of _id to a number
      name: gymData.gymName,
      owner: gymData.ownerName,
      location: gymData.address,
      email: gymData.email,
      phone: gymData.phone,
      status: gymData.status,
      joinedDate: gymData.createdAt
    };
  };

  // Handle updating a gym (modal is using the old format)
  const handleUpdateGym = async (gymId: number, updates: Partial<Gym>) => {
    // Find the real gym
    const realGym = gyms.find(g => parseInt(g._id.substring(g._id.length - 6), 16) === gymId);
    
    if (realGym) {
      try {
        const response = await fetch('/api/admin/gyms', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gymId: realGym._id,
            updates: {
              gymName: updates.name,
              ownerName: updates.owner,
              address: updates.location,
              email: updates.email,
              phone: updates.phone
            }
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update gym');
        }
        
        // Update local state with the changes
        const updatedGyms = gyms.map(gym => 
          gym._id === realGym._id ? { 
            ...gym, 
            gymName: updates.name || gym.gymName,
            ownerName: updates.owner || gym.ownerName,
            address: updates.location || gym.address,
            email: updates.email || gym.email,
            phone: updates.phone || gym.phone
          } : gym
        );
        
        setGyms(updatedGyms);
      } catch (err: any) {
        setError(err.message || 'An error occurred while updating the gym');
      }
    }
    
    setSelectedGym(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gym Management</h1>
          {lastRefreshed && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last refreshed: {format(lastRefreshed, 'dd MMM yyyy HH:mm:ss')}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search gyms..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination({ ...pagination, page: 1 }); // Reset to first page
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <select
              className="pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination({ ...pagination, page: 1 }); // Reset to first page
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          {/* Refresh Button */}
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
            onClick={() => fetchGyms()}
            disabled={loading}
          >
            {loading ? (
              <><Loader className="h-4 w-4 animate-spin" /> Refreshing...</>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setIsStatusHelpOpen(true)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <HelpCircle className="h-4 w-4 mr-1" />
          <span>Status meanings and login implications</span>
        </button>
      </div>
      
      {/* Status Legend - quick reference */}
      <StatusLegend />

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.75l-6 6m0 0l6 6m-6-6h18" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {/* Gym Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Gym Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Owner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader className="h-6 w-6 text-blue-500 animate-spin" />
                      <span className="ml-2 text-gray-500 dark:text-gray-400">Loading gyms...</span>
                    </div>
                  </td>
                </tr>
              ) : gyms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No gyms found
                  </td>
                </tr>
              ) : (
                gyms.map(gym => (
                  <tr key={gym._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {gym.gymName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {gym.ownerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {gym.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {gym.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="group relative">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-full ${getStatusBadgeStyle(gym.status)}`}>
                          {gym.status.charAt(0).toUpperCase() + gym.status.slice(1)}
                        </span>
                        <div className="absolute left-0 -bottom-8 bg-black text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {gym.status === 'active' ? 'Can login' : 'Cannot login'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(gym.createdAt)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative flex items-center gap-2">
                        {/* Status action buttons - uses the enhanced component */}
                        <StatusActionButtons 
                          gymId={gym._id}
                          currentStatus={gym.status}
                          onStatusChange={() => fetchGyms()}
                        />
                        
                        {/* Edit button */}
                        <button
                          onClick={() => setSelectedGym(convertToOldGymFormat(gym))}
                          disabled={actionLoading === gym._id}
                          title="Edit Gym"
                          className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487a2.121 2.121 0 00-3.004 0l-9 9a2.121 2.121 0 000 3.004l3.415 3.415a2.121 2.121 0 003.004 0l9-9a2.121 2.121 0 000-3.004l-3.415-3.415z" />
                          </svg>
                        </button>
                        
                        {/* Delete button */}
                        {showDeleteConfirm === gym._id ? (
                          <div className="absolute right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 z-10 border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <span className="text-xs text-gray-700 dark:text-gray-300">Are you sure?</span>
                            <button
                              onClick={() => handleDeleteGym(gym._id)}
                              disabled={actionLoading === gym._id}
                              className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded"
                            >
                              {actionLoading === gym._id ? 'Deleting...' : 'Yes'}
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirm(gym._id)}
                            disabled={actionLoading === gym._id}
                            title="Delete Gym"
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && pagination.pages > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
              <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="font-medium">{pagination.total}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={pagination.page === 1}
                className={`px-3 py-1 border rounded ${
                  pagination.page === 1 
                    ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
              >
                Previous
              </button>
              
              {/* Page indicator */}
              <div className="px-2 py-1 text-sm font-medium">
                Page <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded">{pagination.page}</span> of {pagination.pages}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={pagination.page >= pagination.pages}
                className={`px-3 py-1 border rounded ${
                  pagination.page >= pagination.pages 
                    ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <EditGymModal isOpen={selectedGym !== null} onClose={() => setSelectedGym(null)} onUpdate={handleUpdateGym} gym={selectedGym} />
      <StatusHelpModal isOpen={isStatusHelpOpen} onClose={() => setIsStatusHelpOpen(false)} />
    </div>
  );
}
