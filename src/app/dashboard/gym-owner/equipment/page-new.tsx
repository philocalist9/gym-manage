'use client';

import React, { useState, useEffect } from 'react';
import EquipmentModal from './components/equipment-modal-new';
import { useAuth } from '@/app/hooks/useAuth';
import { Loader, PlusCircle, Search, Filter, Edit, Trash2, AlertCircle } from 'lucide-react';
import { IEquipment } from '@/app/models/Equipment';

// Format date for display
const formatDate = (dateString?: string | Date) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export default function EquipmentManagement() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<IEquipment | undefined>();
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Equipment state
  const [equipment, setEquipment] = useState<IEquipment[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch equipment data
  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/equipment', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setEquipment(data.equipment);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.equipment.map((item: IEquipment) => item.category))
      );
      setCategories(uniqueCategories);
      
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch equipment:', err);
      setError(err.message || 'Failed to load equipment');
      setEquipment([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleAddNew = () => {
    setModalMode('add');
    setEditingEquipment(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (equipment: IEquipment) => {
    setModalMode('edit');
    setEditingEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/equipment/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        // Update state by removing the deleted item
        setEquipment(equipment.filter(item => item._id !== id));
        setError(null);
      } catch (err: any) {
        console.error('Failed to delete equipment:', err);
        setError(err.message || 'Failed to delete equipment');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async (equipmentData: Omit<IEquipment, '_id'>) => {
    try {
      setIsLoading(true);
      
      if (modalMode === 'add') {
        // Create new equipment
        const response = await fetch('/api/equipment', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(equipmentData),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        
        // Add the new equipment to the state
        setEquipment([...equipment, result.equipment]);
      } else if (modalMode === 'edit' && editingEquipment) {
        // Update existing equipment
        const response = await fetch(`/api/equipment/${editingEquipment._id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(equipmentData),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        
        // Update the equipment in the state
        setEquipment(equipment.map(item => 
          item._id === editingEquipment._id ? result.equipment : item
        ));
      }
      
      setError(null);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save equipment:', err);
      setError(err.message || 'Failed to save equipment');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter equipment based on search and category
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getConditionBadgeClass = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor':
        return 'bg-orange-100 text-orange-800';
      case 'Needs Repair':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Equipment Management</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
      
      <div className="grid gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Equipment Inventory</h2>
            <button 
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              disabled={isLoading}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Equipment
            </button>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search equipment..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchase Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Next Maintenance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEquipment.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        No equipment found
                      </td>
                    </tr>
                  ) : (
                    filteredEquipment.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getConditionBadgeClass(item.condition)}`}>
                            {item.condition}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(item.purchaseDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(item.maintenanceDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${item.cost.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900 mr-4 flex items-center"
                            disabled={isLoading}
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <EquipmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        equipment={editingEquipment}
        mode={modalMode}
      />
    </div>
  );
}
