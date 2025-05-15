"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Send, Phone, Video, Info, MoreVertical, ChevronDown } from "lucide-react";
import { formatTime, formatDate } from "@/app/utils/date-utils";

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

interface Contact {
  id: string;
  name: string;
  status: "online" | "offline";
  lastSeen?: string;
  unreadCount?: number;
  lastMessage?: {
    content: string;
    timestamp: string;
  };
}

export default function MessagesPage() {
  const [contacts] = useState<Contact[]>([
    {
      id: "1",
      name: "John Doe",
      status: "online",
      unreadCount: 2,
      lastMessage: {
        content: "Thanks for today's session!",
        timestamp: "2025-05-15T10:30:00"
      }
    },
    {
      id: "2",
      name: "Sarah Smith",
      status: "offline",
      lastSeen: "2025-05-15T09:15:00",
      lastMessage: {
        content: "See you tomorrow at 9 AM",
        timestamp: "2025-05-15T08:45:00"
      }
    },
    {
      id: "3",
      name: "Mike Johnson",
      status: "online",
      lastMessage: {
        content: "Can we reschedule Thursday's session?",
        timestamp: "2025-05-15T07:20:00"
      }
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: "1",
      senderId: "1",
      recipientId: "trainer",
      content: "Thanks for today's session!",
      timestamp: "2025-05-15T10:30:00",
      status: "read"
    },
    {
      id: "2",
      senderId: "trainer",
      recipientId: "1",
      content: "You're welcome! You did great with the new exercises.",
      timestamp: "2025-05-15T10:31:00",
      status: "delivered"
    },
    {
      id: "3",
      senderId: "1",
      recipientId: "trainer",
      content: "The new workout plan is challenging but I'm enjoying it",
      timestamp: "2025-05-15T10:32:00",
      status: "read"
    }
  ]);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    }
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return formatTime(timestamp);
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return formatDate(timestamp);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    // Add message handling logic here
    setNewMessage("");
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#0B101B] min-h-screen">
      <div className="bg-[#151C2C] rounded-xl h-[calc(100vh-8rem)] flex overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-80 border-r border-gray-800">
          <div className="p-4">
            <h1 className="text-xl font-semibold text-white mb-4">Messages</h1>
            <div className="relative mb-4">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-16rem)]">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id
                    ? "bg-[#1A2234]"
                    : "hover:bg-[#1A2234]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {contact.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#151C2C] ${
                      contact.status === "online" ? "bg-green-500" : "bg-gray-500"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-white font-medium">{contact.name}</h3>
                      {contact.lastMessage && (
                        <span className="text-xs text-gray-400">
                          {formatMessageTime(contact.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    {contact.lastMessage && (
                      <p className="text-sm text-gray-400 line-clamp-1 mt-1">
                        {contact.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {contact.unreadCount && (
                    <div className="min-w-[20px] h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {contact.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {selectedContact.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#151C2C] ${
                    selectedContact.status === "online" ? "bg-green-500" : "bg-gray-500"
                  }`} />
                </div>
                <div>
                  <h2 className="text-white font-medium">{selectedContact.name}</h2>
                  <p className="text-sm text-gray-400">
                    {selectedContact.status === "online"
                      ? "Online"
                      : selectedContact.lastSeen
                      ? `Last seen ${formatLastSeen(selectedContact.lastSeen)}`
                      : "Offline"
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1A2234] rounded-lg transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1A2234] rounded-lg transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1A2234] rounded-lg transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === "trainer" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className={`max-w-[70%] ${
                    message.senderId === "trainer"
                      ? "bg-blue-600 text-white"
                      : "bg-[#1A2234] text-gray-200"
                  } rounded-lg px-4 py-2`}>
                    <p>{message.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs opacity-75">
                        {formatMessageTime(message.timestamp)}
                      </span>
                      {message.senderId === "trainer" && (
                        <span className="text-xs">
                          {message.status === "sent" ? "✓" : message.status === "delivered" ? "✓✓" : "✓✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
