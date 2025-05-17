"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, AlertTriangle, Clock } from "lucide-react";
import { 
  formatDate as formatDateUtil, 
  isPaymentDueSoon, 
  isPastDuePayment,
  getPaymentStatus,
  getDaysUntil
} from "@/app/utils/date-utils";

// Helper function for consistent date formatting
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

interface MemberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}

interface TrainerInfo {
  [key: string]: string;
}

interface Member {
  _id: string;
  name: string;
  email: string;
  memberNumber: string;
  membershipType: "Basic" | "Premium" | "VIP";
  status: "Active" | "Inactive" | "Pending";
  joiningDate: string;
  nextPayment: string;
  trainer: string | null;
  attendance: number;
}

export default function MemberDetailsModal({ isOpen, onClose, member }: MemberDetailsModalProps) {
  const [trainerNames, setTrainerNames] = useState<TrainerInfo>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch trainer names when modal opens
  useEffect(() => {
    if (isOpen && member && member.trainer) {
      const fetchTrainerInfo = async () => {
        try {
          setIsLoading(true);
          const response = await fetch('/api/trainers');
          if (response.ok) {
            const data = await response.json();
            const nameMap: TrainerInfo = {};
            
            data.trainers.forEach((trainer: any) => {
              nameMap[trainer._id] = trainer.name;
            });
            
            setTrainerNames(nameMap);
          }
        } catch (error) {
          console.error('Error fetching trainer info:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchTrainerInfo();
    }
  }, [isOpen, member]);
  
  if (!isOpen || !member) return null;

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
            {member.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{member.name}</h2>
            <p className="text-gray-400">{member.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#1A2234] p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-400 mb-1">Member Number</p>
            <p className="text-gray-200 font-medium">{member.memberNumber}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Membership Type</p>
              <p className="text-gray-200 font-medium">{member.membershipType}</p>
            </div>
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium
                ${member.status === "Active" 
                  ? "bg-green-500/10 text-green-500"
                  : member.status === "Inactive"
                  ? "bg-red-500/10 text-red-500"
                  : "bg-yellow-500/10 text-yellow-500"
                }`}>
                {member.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Joining Date</p>
              <p className="text-gray-200 font-medium">
                {formatDate(member.joiningDate)}
              </p>
            </div>
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Next Payment</p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-gray-200 font-medium">
                    {formatDate(member.nextPayment)}
                  </p>
                  {(() => {
                    const paymentStatus = getPaymentStatus(member.nextPayment);
                    
                    if (paymentStatus.status === 'overdue') {
                      return (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500/10 text-red-500 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span>
                            {paymentStatus.daysOverdue === 1 ? '1 day overdue' : `${paymentStatus.daysOverdue} days overdue`}
                          </span>
                        </span>
                      );
                    }
                    
                    if (paymentStatus.status === 'due-soon') {
                      return (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-500/10 text-yellow-500 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>
                            {paymentStatus.daysUntil === 0 ? 'Due today' : 
                            paymentStatus.daysUntil === 1 ? 'Due tomorrow' : 
                            `Due in ${paymentStatus.daysUntil} days`}
                          </span>
                        </span>
                      );
                    }
                    
                    return (
                      <span className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500/10 text-green-500 rounded-full">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {paymentStatus.daysUntil && `In ${paymentStatus.daysUntil} days`}
                        </span>
                      </span>
                    );
                  })()}
                </div>
                
                {/* Add a reminder action button for payments due soon or overdue */}
                {(isPaymentDueSoon(member.nextPayment) || isPastDuePayment(member.nextPayment)) && (
                  <button className="mt-2 text-xs text-blue-500 hover:text-blue-400 text-left">
                    Send payment reminder
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Assigned Trainer</p>
              <p className="text-gray-200 font-medium">
                {member.trainer 
                  ? (trainerNames[member.trainer] || "Loading...") 
                  : "No Trainer"}
              </p>
            </div>
            <div className="bg-[#1A2234] p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Attendance Rate</p>
              <p className="text-gray-200 font-medium">{member.attendance}%</p>
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
