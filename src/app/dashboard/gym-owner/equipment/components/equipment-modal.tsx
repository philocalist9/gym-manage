'use client';

import React, { useEffect } from 'react';
import { IEquipment } from '@/app/models/Equipment';

type EquipmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipmentData: Omit<IEquipment, '_id'>) => void;
  equipment?: IEquipment;
  mode: 'add' | 'edit';
};

export default function EquipmentModal({ isOpen, onClose, onSave, equipment, mode }: EquipmentModalProps) {
  const [formData, setFormData] = React.useState<Partial<IEquipment>>({
    name: '',
    category: '',
    serialNumber: '',
    purchaseDate: new Date(),
    condition: 'Good',
    cost: 0,
    quantity: 1,
    weight: 0,
    isInUse: true
  });

  useEffect(() => {
    if (equipment && mode === 'edit') {
      setFormData({
        ...equipment,
        purchaseDate: equipment.purchaseDate || new Date()
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        category: '',
        serialNumber: '',
        purchaseDate: new Date(),
        condition: 'Good',
        cost: 0,
        quantity: 1,
        weight: 0,
        isInUse: true
      });
    }
  }, [equipment, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<IEquipment, '_id'>);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else if (name === 'purchaseDate') {
      setFormData({
        ...formData,
        [name]: new Date(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'add' ? 'Add New Equipment' : 'Edit Equipment'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Equipment Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="Cardio">Cardio</option>
                <option value="Strength">Strength</option>
                <option value="Free Weights">Free Weights</option>
                <option value="Machines">Machines</option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Cost */}
            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cost ($) *
              </label>
              <input
                id="cost"
                name="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost || 0}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                No. of Equipment *
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity || 1}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                required
              />
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weight (kg)
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                min="0"
                step="0.1"
                value={formData.weight || 0}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              />
            </div>

            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Condition *
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition || 'Good'}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                required
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
                <option value="Needs Repair">Needs Repair</option>
              </select>
            </div>

            {/* Purchase Date */}
            <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Purchase Date *
              </label>
              <input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                value={formatDateForInput(formData.purchaseDate)}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                required
              />
            </div>

            {/* Serial Number */}
            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Serial Number
              </label>
              <input
                id="serialNumber"
                name="serialNumber"
                type="text"
                value={formData.serialNumber || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              />
            </div>

            {/* Is In Use */}
            <div className="flex items-center h-full mt-6">
              <input
                id="isInUse"
                name="isInUse"
                type="checkbox"
                checked={formData.isInUse || false}
                onChange={(e) => setFormData({ ...formData, isInUse: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="isInUse" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Currently In Use
              </label>
            </div>
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
