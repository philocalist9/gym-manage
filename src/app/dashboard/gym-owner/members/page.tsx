"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Filter, MoreVertical, ChevronDown } from "lucide-react";
import AddMemberModal from "./components/add-member-modal";
import MemberDetailsModal from "./components/member-details-modal";

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
  id: string;
  name: string;
  email: string;
  membershipType: "Basic" | "Premium" | "VIP";
  status: "Active" | "Inactive" | "Pending";
  joiningDate: string;
  nextPayment: string;
  trainer: string;
  attendance: number;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Alex Thompson",
      email: "alex.t@example.com",
      membershipType: "Premium",
      status: "Active",
      joiningDate: "2025-01-10",
      nextPayment: "2025-06-10",
      trainer: "John Smith",
      attendance: 85,
    },
    {
      id: "2",
      name: "Emma Wilson",
      email: "emma.w@example.com",
      membershipType: "Basic",
      status: "Active",
      joiningDate: "2025-02-15",
      nextPayment: "2025-06-15",
      trainer: "Sarah Johnson",
      attendance: 92,
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael.b@example.com",
      membershipType: "VIP",
      status: "Inactive",
      joiningDate: "2024-12-01",
      nextPayment: "2025-06-01",
      trainer: "Mike Wilson",
      attendance: 65,
    },
  ]);

  // States for modals and filters
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [membershipFilter, setMembershipFilter] = useState<string>("all");
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  // Filter members based on search, status, and membership type
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.trainer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === "all" || member.status === statusFilter;

      const matchesMembership =
        membershipFilter === "all" || member.membershipType === membershipFilter;

      return matchesSearch && matchesStatus && matchesMembership;
    });
  }, [members, searchQuery, statusFilter, membershipFilter]);

  // Handlers
  const handleAddMember = (newMember: Omit<Member, "id">) => {
    const id = (members.length + 1).toString();
    setMembers([...members, { ...newMember, id }]);
  };

  const handleActionClick = (memberId: string) => {
    setActiveActionMenu(activeActionMenu === memberId ? null : memberId);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    setActiveActionMenu(null);
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

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#151C2C] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-3">
          {/* Status Filter */}
          <div className="relative">
            <button 
              onClick={() => setStatusFilter(statusFilter === "all" ? "Active" : "all")}
              className="flex items-center gap-2 px-4 py-2 bg-[#151C2C] text-gray-200 rounded-lg hover:bg-[#1A2234] transition-colors border border-gray-800"
            >
              <Filter className="w-5 h-5" />
              <span>Status: {statusFilter === "all" ? "All" : statusFilter}</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {statusFilter !== "all" && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-[#151C2C] rounded-lg shadow-xl border border-gray-800">
                <button
                  onClick={() => setStatusFilter("all")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("Active")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter("Inactive")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Inactive
                </button>
                <button
                  onClick={() => setStatusFilter("Pending")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Pending
                </button>
              </div>
            )}
          </div>

          {/* Membership Filter */}
          <div className="relative">
            <button 
              onClick={() => setMembershipFilter(membershipFilter === "all" ? "Basic" : "all")}
              className="flex items-center gap-2 px-4 py-2 bg-[#151C2C] text-gray-200 rounded-lg hover:bg-[#1A2234] transition-colors border border-gray-800"
            >
              <span>Membership: {membershipFilter === "all" ? "All" : membershipFilter}</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {membershipFilter !== "all" && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-[#151C2C] rounded-lg shadow-xl border border-gray-800">
                <button
                  onClick={() => setMembershipFilter("all")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  All
                </button>
                <button
                  onClick={() => setMembershipFilter("Basic")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Basic
                </button>
                <button
                  onClick={() => setMembershipFilter("Premium")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  Premium
                </button>
                <button
                  onClick={() => setMembershipFilter("VIP")}
                  className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                >
                  VIP
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-[#151C2C] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1A2234] text-gray-400 text-sm">
            <tr>
              <th className="text-left py-4 px-6 font-medium">Name</th>
              <th className="text-left py-4 px-6 font-medium">Membership</th>
              <th className="text-left py-4 px-6 font-medium">Status</th>
              <th className="text-left py-4 px-6 font-medium">Trainer</th>
              <th className="text-left py-4 px-6 font-medium">Next Payment</th>
              <th className="text-left py-4 px-6 font-medium">Attendance</th>
              <th className="text-left py-4 px-6 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredMembers.map((member) => (
              <tr key={member.id} className="hover:bg-[#1A2234] transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => setSelectedMember(member)}
                      className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium cursor-pointer"
                    >
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-sm text-gray-400">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${member.membershipType === "VIP" 
                      ? "bg-purple-500/10 text-purple-500"
                      : member.membershipType === "Premium"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-gray-500/10 text-gray-300"
                    }`}>
                    {member.membershipType}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${member.status === "Active" 
                      ? "bg-green-500/10 text-green-500"
                      : member.status === "Inactive"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                    {member.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-200">{member.trainer}</td>
                <td className="py-4 px-6 text-gray-200">
                  {formatDate(member.nextPayment)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          member.attendance >= 80 ? "bg-green-500" :
                          member.attendance >= 60 ? "bg-yellow-500" :
                          "bg-red-500"
                        }`}
                        style={{ width: `${member.attendance}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">{member.attendance}%</span>
                  </div>
                </td>
                <td className="py-4 px-6 relative">
                  <button 
                    onClick={() => handleActionClick(member.id)}
                    className="p-2 hover:bg-[#212B42] rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                  {activeActionMenu === member.id && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-[#151C2C] rounded-lg shadow-xl border border-gray-800">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setActiveActionMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-200 hover:bg-[#1A2234]"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="w-full px-4 py-2 text-left text-red-500 hover:bg-[#1A2234]"
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

      {/* Modals */}
      <AddMemberModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMember}
      />
      <MemberDetailsModal 
        isOpen={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
      />
    </div>
  );
}
