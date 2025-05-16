'use client';

import React, { useEffect } from 'react';

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

interface MachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (machine: Omit<Machine, 'id'>) => void;
  machine?: Machine;
  mode: 'add' | 'edit';
}

export default function MachineModal({ isOpen, onClose, onSave, machine, mode }: MachineModalProps) {
  const [formData, setFormData] = React.useState<Omit<Machine, 'id'>>({
    name: '',
    status: 'operational',
    manufacturer: '',
    model: '',
    serialNumber: '',
    lastService: new Date().toISOString().split('T')[0],
    nextServiceDue: new Date().toISOString().split('T')[0],
    maintenanceHistory: '',
    usageHours: 0
  });

  useEffect(() => {
    if (machine && mode === 'edit') {
      setFormData(machine);
    }
  }, [machine, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'add' ? 'Add New Machine' : 'Edit Machine'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Machine Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Machine['status'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            >
              <option value="operational">Operational</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="out-of-order">Out of Order</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Manufacturer
            </label>
            <input
              type="text"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Model
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Serial Number
            </label>
            <input
              type="text"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Service Date
            </label>
            <input
              type="date"
              value={formData.lastService}
              onChange={(e) => setFormData({ ...formData, lastService: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Next Service Due
            </label>
            <input
              type="date"
              value={formData.nextServiceDue}
              onChange={(e) => setFormData({ ...formData, nextServiceDue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Usage Hours
            </label>
            <input
              type="number"
              value={formData.usageHours}
              onChange={(e) => setFormData({ ...formData, usageHours: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Maintenance History
            </label>
            <textarea
              value={formData.maintenanceHistory}
              onChange={(e) => setFormData({ ...formData, maintenanceHistory: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {mode === 'add' ? 'Add Machine' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
