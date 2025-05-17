"use client";

import React from "react";
import { X } from "lucide-react";

interface TrainerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: Trainer | null;
}

interface Trainer {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  bio: string;
  experience: number;
  totalClients: number;
  rating: number;
  joinDate: string;
  phone?: string;
}

export default function TrainerDetailsModal({ isOpen, onClose, trainer }: TrainerDetailsModalProps) {
  if (!isOpen || !trainer) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#151C2C] rounded-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-medium">
            {trainer.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{trainer.name}</h2>
            <p className="text-gray-400">{trainer.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Specialization</p>
              <p className="text-gray-200 font-medium">{trainer.specialization}</p>
            </div>
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Experience</p>
              <p className="text-gray-200 font-medium">{trainer.experience} {trainer.experience === 1 ? 'year' : 'years'}</p>
            </div>
            {trainer.phone && (
              <div className="bg-[#1A2234] p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Phone</p>
                <p className="text-gray-200 font-medium">{trainer.phone}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Total Clients</p>
              <p className="text-gray-200 font-medium">{trainer.totalClients}</p>
            </div>
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Rating</p>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-gray-200 font-medium">{trainer.rating}</span>
              </div>
            </div>
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Join Date</p>
              <p className="text-gray-200 font-medium">
                {new Date(trainer.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Biography</p>
              <p className="text-gray-200">{trainer.bio}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#1A2234] text-gray-200 rounded-lg hover:bg-[#212B42] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
