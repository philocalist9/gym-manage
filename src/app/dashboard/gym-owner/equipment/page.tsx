'use client';

import React, { useState } from 'react';
import EquipmentModal from './components/equipment-modal';

interface Equipment {
  id: string;
  name: string;
  status: 'active' | 'maintenance' | 'out-of-order';
  lastMaintained: string;
  nextMaintenance: string;
  quantity: number;
  notes: string;
}

export default function EquipmentManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | undefined>();
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  
  // In a real application, this would come from an API
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'Dumbbells Set (5-50 lbs)',
      status: 'active',
      lastMaintained: '2025-05-01',
      nextMaintenance: '2025-08-01',
      quantity: 10,
      notes: 'Regular inspection required for rubber coating'
    },
    {
      id: '2',
      name: 'Olympic Barbell',
      status: 'maintenance',
      lastMaintained: '2025-04-15',
      nextMaintenance: '2025-05-15',
      quantity: 5,
      notes: 'Check for bending and wear'
    }
  ]);

  const handleAddNew = () => {
    setModalMode('add');
    setEditingEquipment(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (equipment: Equipment) => {
    setModalMode('edit');
    setEditingEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      setEquipment(equipment.filter(item => item.id !== id));
    }
  };

  const handleSave = (equipmentData: Omit<Equipment, 'id'>) => {
    if (modalMode === 'add') {
      setEquipment([...equipment, { ...equipmentData, id: Date.now().toString() }]);
    } else if (editingEquipment) {
      setEquipment(equipment.map(item => 
        item.id === editingEquipment.id ? { ...equipmentData, id: item.id } : item
      ));
    }
  };

  const getStatusBadgeClass = (status: Equipment['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-order':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Equipment Management</h1>
      <div className="grid gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Equipment Inventory</h2>
            <button 
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add New Equipment
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Maintained</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Next Maintenance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {equipment.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.lastMaintained}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.nextMaintenance}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
