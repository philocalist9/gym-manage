'use client';

import React, { useEffect } from 'react';

interface Equipment {
  id: string;
  name: string;
  status: 'active' | 'maintenance' | 'out-of-order';
  lastMaintained: string;
  nextMaintenance: string;
  quantity: number;
  notes: string;
}

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: Omit<Equipment, 'id'>) => void;
  equipment?: Equipment;
  mode: 'add' | 'edit';
}

export default function EquipmentModal({ isOpen, onClose, onSave, equipment, mode }: EquipmentModalProps) {
  const [formData, setFormData] = React.useState<Omit<Equipment, 'id'>>({
    name: '',
    status: 'active',
    lastMaintained: new Date().toISOString().split('T')[0],
    nextMaintenance: new Date().toISOString().split('T')[0],
    quantity: 1,
    notes: ''
  });

  useEffect(() => {
    if (equipment && mode === 'edit') {
      setFormData(equipment);
    }
  }, [equipment, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'add' ? 'Add New Equipment' : 'Edit Equipment'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Equipment Name
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
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Equipment['status'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            >
              <option value="active">Active</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="out-of-order">Out of Order</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Maintained
            </label>
            <input
              type="date"
              value={formData.lastMaintained}
              onChange={(e) => setFormData({ ...formData, lastMaintained: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Next Maintenance Due
            </label>
            <input
              type="date"
              value={formData.nextMaintenance}
              onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              {mode === 'add' ? 'Add Equipment' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
