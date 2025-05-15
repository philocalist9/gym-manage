"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface EditGymModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (gymId: number, updates: Partial<Gym>) => void;
  gym: Gym | null;
}

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

export default function EditGymModal({ isOpen, onClose, onUpdate, gym }: EditGymModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    location: "",
  });

  React.useEffect(() => {
    if (gym) {
      setFormData({
        name: gym.name,
        owner: gym.owner,
        location: gym.location,
      });
    }
  }, [gym]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gym) return;

    onUpdate(gym.id, formData);
    onClose();
  };

  if (!isOpen || !gym) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Edit Gym</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Gym Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="City, State"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
