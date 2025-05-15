"use client";

import { useState } from 'react';
import { Search, Filter, MoreVertical, Edit2, CheckCircle, XCircle } from 'lucide-react';
import AddGymModal from './components/add-gym-modal';
import EditGymModal from './components/edit-gym-modal';

interface Gym {
  id: number;
  name: string;
  owner: string;
  location: string;
  memberCount: number;
  revenue: number;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
}

export default function GymManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);

  // Mock data
  const [gyms, setGyms] = useState<Gym[]>([
    {
      id: 1,
      name: "FitZone Plus",
      owner: "John Smith",
      location: "New York, NY",
      memberCount: 250,
      revenue: 25000,
      status: 'active',
      joinedDate: '2024-01-15'
    },
    {
      id: 2,
      name: "PowerHouse Gym",
      owner: "Sarah Johnson",
      location: "Los Angeles, CA",
      memberCount: 180,
      revenue: 18000,
      status: 'active',
      joinedDate: '2024-02-20'
    },
    {
      id: 3,
      name: "Elite Fitness Club",
      owner: "Mike Wilson",
      location: "Chicago, IL",
      memberCount: 0,
      revenue: 0,
      status: 'pending',
      joinedDate: '2024-05-01'
    },
    {
      id: 4,
      name: "CrossTrain Center",
      owner: "Emily Brown",
      location: "Houston, TX",
      memberCount: 120,
      revenue: 12000,
      status: 'inactive',
      joinedDate: '2023-11-10'
    }
  ]);

  const filteredGyms = gyms.filter(gym => {
    const matchesSearch = 
      gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || gym.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'members':
        return b.memberCount - a.memberCount;
      case 'revenue':
        return b.revenue - a.revenue;
      case 'date':
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleAddGym = (newGym: Omit<Gym, "id">) => {
    const id = Math.max(...gyms.map(g => g.id)) + 1;
    setGyms([...gyms, { ...newGym, id }]);
  };

  const handleUpdateGym = (gymId: number, updates: Partial<Gym>) => {
    setGyms(gyms.map(gym => 
      gym.id === gymId ? { ...gym, ...updates } : gym
    ));
  };

  const handleStatusChange = (gymId: number) => {
    setGyms(gyms.map(gym => {
      if (gym.id === gymId) {
        const newStatus = gym.status === 'active' ? 'inactive' : 'active';
        return { ...gym, status: newStatus };
      }
      return gym;
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gym Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage and monitor all registered gyms in the system</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search gyms..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="members">Sort by Members</option>
            <option value="revenue">Sort by Revenue</option>
            <option value="date">Sort by Join Date</option>
          </select>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Gym
        </button>
      </div>

      {/* Gym List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Gym Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredGyms.map((gym) => (
                <tr key={gym.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{gym.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{gym.owner}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{gym.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{gym.memberCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      ${gym.revenue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(gym.status)}`}>
                      {gym.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedGym(gym)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(gym.id)}
                        className={`${
                          gym.status === 'active' 
                            ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                            : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                        }`}
                      >
                        {gym.status === 'active' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredGyms.length} of {gyms.length} gyms
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddGymModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddGym}
      />
      <EditGymModal
        isOpen={selectedGym !== null}
        onClose={() => setSelectedGym(null)}
        onUpdate={handleUpdateGym}
        gym={selectedGym}
      />
    </div>
  );
}
