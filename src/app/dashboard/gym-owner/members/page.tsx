"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Filter, MoreVertical, Loader, Clock, AlertTriangle, Calendar } from "lucide-react";
import AddMemberModal from "./components/add-member-modal";
import MemberDetailsModal from "./components/member-details-modal";
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

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [trainerNames, setTrainerNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals and filters state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all"); // New payment filter
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch members from the API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/members');
        
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        
        const data = await response.json();
        
        setMembers(data.members.map((member: any) => ({
          _id: member._id,
          name: member.name,
          email: member.email,
          memberNumber: member.memberNumber || '000000', // Include member number with fallback
          membershipType: member.membershipType,
          status: member.status,
          joiningDate: new Date(member.joiningDate).toISOString(),
          nextPayment: new Date(member.nextPayment).toISOString(),
          trainer: member.trainer,
          attendance: member.attendance,
        })));
        
        // Also fetch trainers to map trainer IDs to names
        const trainersResponse = await fetch('/api/trainers');
        if (trainersResponse.ok) {
          const trainersData = await trainersResponse.json();
          const trainerMap: Record<string, string> = {};
          
          trainersData.trainers.forEach((trainer: any) => {
            trainerMap[trainer._id] = trainer.name;
          });
          
          setTrainerNames(trainerMap);
        }
      } catch (err: any) {
        console.error('Error fetching members:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMembers();
  }, []);

  // Filtered members based on search and filters
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Search filter
      const matchesSearch = 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.memberNumber.includes(searchQuery);
      
      // Status filter
      const matchesStatus = statusFilter === "all" || member.status === statusFilter;
      
      // Membership filter
      const matchesMembership = membershipFilter === "all" || member.membershipType === membershipFilter;
      
      // Payment status filter
      let matchesPayment = true;
      if (paymentFilter !== "all") {
        if (paymentFilter === "overdue") {
          matchesPayment = isPastDuePayment(member.nextPayment);
        } else if (paymentFilter === "due-soon") {
          matchesPayment = isPaymentDueSoon(member.nextPayment);
        } else if (paymentFilter === "upcoming") {
          // Not overdue and not due soon = upcoming
          matchesPayment = !isPastDuePayment(member.nextPayment) && !isPaymentDueSoon(member.nextPayment);
        }
      }
      
      return matchesSearch && matchesStatus && matchesMembership && matchesPayment;
    })
    // Sort the filtered results
    .sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc" 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } 
      
      if (sortField === "joiningDate") {
        const dateA = new Date(a.joiningDate).getTime();
        const dateB = new Date(b.joiningDate).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      
      if (sortField === "nextPayment") {
        const dateA = new Date(a.nextPayment).getTime();
        const dateB = new Date(b.nextPayment).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      
      return 0;
    });
  }, [members, searchQuery, statusFilter, membershipFilter, paymentFilter, sortField, sortDirection]);

  // Handlers
  const handleAddMember = async (newMember: Omit<Member, "_id">) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add member');
      }

      const data = await response.json();
      
      // Add the new member to the state
      setMembers([...members, {
        ...data.member,
        joiningDate: new Date(data.member.joiningDate).toISOString(),
        nextPayment: new Date(data.member.nextPayment).toISOString()
      }]);
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding the member');
      console.error('Error adding member:', err);
      throw err; // Re-throw to be caught by the modal
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (memberId: string) => {
    setActiveActionMenu(activeActionMenu === memberId ? null : memberId);
  };

  const handleDeleteMember = async (id: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete member');
      }
      
      // Update UI after successful deletion
      setMembers(members.filter(m => m._id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the member');
      console.error('Error deleting member:', err);
    } finally {
      setIsLoading(false);
      setActiveActionMenu(null);
    }
  };

  // Status badge colors
  const getStatusBadgeClass = (status: Member['status']) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Membership type badge colors
  const getMembershipBadgeClass = (type: Member['membershipType']) => {
    switch (type) {
      case "Premium":
        return "bg-purple-100 text-purple-800";
      case "VIP":
        return "bg-blue-100 text-blue-800";
      default: // Basic
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 bg-[#0B101B] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white">Members</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Payment Summary Cards */}
      {!isLoading && members.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#151C2C] border border-yellow-500/20 rounded-lg p-4 flex items-center">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-500 mr-3">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Payments Due Soon</p>
              <p className="text-white text-lg font-semibold">
                {members.filter(m => isPaymentDueSoon(m.nextPayment)).length}
              </p>
              <p className="text-xs text-gray-500">Next 7 days</p>
            </div>
          </div>
          
          <div className="bg-[#151C2C] border border-red-500/20 rounded-lg p-4 flex items-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 mr-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Overdue Payments</p>
              <p className="text-white text-lg font-semibold">
                {members.filter(m => isPastDuePayment(m.nextPayment)).length}
              </p>
              <p className="text-xs text-gray-500">
                Needs immediate attention
              </p>
            </div>
          </div>
          
          <div className="bg-[#151C2C] border border-green-500/20 rounded-lg p-4 flex items-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 mr-3">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Up-to-date Members</p>
              <p className="text-white text-lg font-semibold">
                {members.filter(m => !isPaymentDueSoon(m.nextPayment) && !isPastDuePayment(m.nextPayment)).length}
              </p>
              <p className="text-xs text-gray-500">
                More than 7 days until payment
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#151C2C] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#151C2C] border border-gray-800 rounded-lg text-gray-200 appearance-none focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={membershipFilter}
              onChange={(e) => setMembershipFilter(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#151C2C] border border-gray-800 rounded-lg text-gray-200 appearance-none focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Memberships</option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#151C2C] border border-gray-800 rounded-lg text-gray-200 appearance-none focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Payments</option>
              <option value="overdue">Overdue</option>
              <option value="due-soon">Due Soon</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center">
            <Loader className="w-8 h-8 animate-spin text-blue-500 mb-2" />
            <p className="text-gray-400">Loading members...</p>
          </div>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          {members.length === 0 ? "No members found. Add your first member!" : "No members match your filters."}
        </div>
      ) : (
        // Members Table
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th 
                  className="pb-4 text-left text-gray-400 font-medium cursor-pointer hover:text-white"
                  onClick={() => {
                    if (sortField === "name") {
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    } else {
                      setSortField("name");
                      setSortDirection("asc");
                    }
                  }}
                >
                  Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="pb-4 text-left text-gray-400 font-medium">Member #</th>
                <th className="pb-4 text-left text-gray-400 font-medium">Email</th>
                <th className="pb-4 text-left text-gray-400 font-medium">Membership</th>
                <th className="pb-4 text-left text-gray-400 font-medium">Status</th>
                <th 
                  className="pb-4 text-left text-gray-400 font-medium cursor-pointer hover:text-white"
                  onClick={() => {
                    if (sortField === "joiningDate") {
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    } else {
                      setSortField("joiningDate");
                      setSortDirection("asc");
                    }
                  }}
                >
                  Join Date {sortField === "joiningDate" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="pb-4 text-left text-gray-400 font-medium cursor-pointer hover:text-white"
                  onClick={() => {
                    if (sortField === "nextPayment") {
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    } else {
                      setSortField("nextPayment");
                      setSortDirection("asc");
                    }
                  }}
                >
                  Next Payment {sortField === "nextPayment" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="pb-4 text-left text-gray-400 font-medium">Trainer</th>
                <th className="pb-4 text-right text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr 
                  key={member._id} 
                  className="border-b border-gray-800 hover:bg-[#151C2C] cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <td className="py-4 text-gray-300">{member.name}</td>
                  <td className="py-4 text-gray-300 font-mono">{member.memberNumber}</td>
                  <td className="py-4 text-gray-300">{member.email}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getMembershipBadgeClass(member.membershipType)}`}>
                      {member.membershipType}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-300">{formatDate(member.joiningDate)}</td>
                  <td className="py-4">
                    {(() => {
                      const paymentStatus = getPaymentStatus(member.nextPayment);
                      
                      if (paymentStatus.status === 'overdue') {
                        return (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-300">{formatDate(member.nextPayment)}</span>
                            <div className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              <span className="ml-1 text-xs text-red-500">
                                {paymentStatus.daysOverdue === 1 ? '1 day' : `${paymentStatus.daysOverdue} days`} overdue
                              </span>
                            </div>
                          </div>
                        );
                      }
                      
                      if (paymentStatus.status === 'due-soon') {
                        return (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-300">{formatDate(member.nextPayment)}</span>
                            <div className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                              <span className="ml-1 text-xs text-yellow-500">
                                {paymentStatus.daysUntil === 0 ? 'Today' : 
                                 paymentStatus.daysUntil === 1 ? 'Tomorrow' :
                                 `${paymentStatus.daysUntil} days`}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-300">{formatDate(member.nextPayment)}</span>
                          {paymentStatus.daysUntil !== undefined && paymentStatus.daysUntil <= 14 && (
                            <span className="ml-1 text-xs text-gray-500">
                              in {paymentStatus.daysUntil} days
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="py-4 text-gray-300">
                    {member.trainer && trainerNames[member.trainer] ? 
                      trainerNames[member.trainer] : 'No Trainer'}
                  </td>
                  <td className="py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleActionClick(member._id)}
                      className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    {activeActionMenu === member._id && (
                      <div className="absolute top-full mt-1 right-0 w-48 bg-[#1A2234] rounded-lg border border-gray-800 shadow-xl overflow-hidden z-10">
                        <button 
                          onClick={() => setSelectedMember(member)}
                          className="px-4 py-2 w-full text-left hover:bg-[#232B3E] transition-colors text-gray-300"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(member._id)}
                          className="px-4 py-2 w-full text-left hover:bg-[#232B3E] transition-colors text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Add Member Modal */}
      <AddMemberModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddMember} 
      />
      
      {/* Member Details Modal */}
      <MemberDetailsModal 
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
      />
    </div>
  );
}
