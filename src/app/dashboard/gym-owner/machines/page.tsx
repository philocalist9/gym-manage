'use client';

import React, { useState } from 'react';
import MachineModal from './components/machine-modal';

interface Machine {
  id: string;
  name: string;
  status: 'operational' | 'maintenance' | 'out-of-order';
  manufacturer: string;
  model: string;
  serialNumber: string;
  lastService: string;
  nextServiceDue: string;
  maintenanceHistory: string;
  usageHours: number;
}

export default function GymMachinesManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | undefined>();
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  
  // In a real application, this would come from an API
  const [machines, setMachines] = useState<Machine[]>([
    {
      id: '1',
      name: 'Treadmill X2000',
      manufacturer: 'FitTech',
      model: 'PRO-2000',
      serialNumber: 'TM2000-123',
      status: 'operational',
      lastService: '2025-04-15',
      nextServiceDue: '2025-07-15',
      maintenanceHistory: 'Regular maintenance performed on schedule',
      usageHours: 2500
    },
    {
      id: '2',
      name: 'Leg Press Machine',
      manufacturer: 'GymEquip',
      model: 'LP-500',
      serialNumber: 'LP500-456',
      status: 'maintenance',
      lastService: '2025-05-01',
      nextServiceDue: '2025-06-01',
      maintenanceHistory: 'Hydraulic pressure system needs checking',
      usageHours: 1800
    }
  ]);

  const handleAddNew = () => {
    setModalMode('add');
    setEditingMachine(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (machine: Machine) => {
    setModalMode('edit');
    setEditingMachine(machine);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this machine?')) {
      setMachines(machines.filter(item => item.id !== id));
    }
  };

  const handleSave = (machineData: Omit<Machine, 'id'>) => {
    if (modalMode === 'add') {
      setMachines([...machines, { ...machineData, id: Date.now().toString() }]);
    } else if (editingMachine) {
      setMachines(machines.map(item => 
        item.id === editingMachine.id ? { ...machineData, id: item.id } : item
      ));
    }
  };

  const handleService = (machine: Machine) => {
    const today = new Date().toISOString().split('T')[0];
    const nextService = new Date();
    nextService.setMonth(nextService.getMonth() + 3); // Set next service to 3 months from now

    const updatedMachine = {
      ...machine,
      lastService: today,
      nextServiceDue: nextService.toISOString().split('T')[0],
      status: 'operational' as const,
      maintenanceHistory: `${machine.maintenanceHistory}\nServiced on ${today}`
    };

    setMachines(machines.map(item =>
      item.id === machine.id ? updatedMachine : item
    ));
  };

  const getStatusBadgeClass = (status: Machine['status']) => {
    switch (status) {
      case 'operational':
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
      <h1 className="text-2xl font-bold mb-6">Gym Machines Management</h1>
      <div className="grid gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Machines Inventory</h2>
            <button 
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add New Machine
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Machine Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Manufacturer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Next Service Due</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {machines.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.manufacturer}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.lastService}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.nextServiceDue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleService(item)}
                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                      >
                        Service
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

      <MachineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        machine={editingMachine}
        mode={modalMode}
      />
    </div>
  );
}
