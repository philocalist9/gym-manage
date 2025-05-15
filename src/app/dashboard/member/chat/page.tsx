"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Send, Phone, Video, Info, MoreVertical } from "lucide-react";
import { formatTime, formatDate } from "@/app/utils/date-utils";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: "member" | "trainer";
  read: boolean;
}

interface Trainer {
  id: string;
  name: string;
  status: "online" | "offline";
  lastMessage?: Message;
  specialty: string;
  rating: number;
}

export default function MemberChatPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([
    {
      id: "1",
      name: "Alex Thompson",
      status: "online",
      specialty: "Strength Training",
      rating: 4.8,
      lastMessage: {
        id: "msg1",
        content: "Great progress on your workout today!",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        sender: "trainer",
        read: true,
      },
    },
    {
      id: "2",
      name: "Sarah Miller",
      status: "offline",
      specialty: "HIIT & Cardio",
      rating: 4.9,
      lastMessage: {
        id: "msg2",
        content: "Let's adjust your meal plan for next week",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        sender: "trainer",
        read: false,
      },
    },
  ]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedTrainer) {
      // In a real app, fetch messages for the selected trainer
      const mockMessages: Message[] = [
        {
          id: "1",
          content: "Hi! How's your training going?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          sender: "trainer",
          read: true,
        },
        {
          id: "2",
          content: "I'm making good progress! The new routine is working well.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
          sender: "member",
          read: true,
        },
        {
          id: "3",
          content: "That's great to hear! Keep up the good work 💪",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
          sender: "trainer",
          read: true,
        },
      ];
      setMessages(mockMessages);
    }
  }, [selectedTrainer]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTrainer) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      sender: "member",
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return formatTime(date);
    }
    if (date.getFullYear() === now.getFullYear()) {
      return formatDate(date);
    }
    return formatDate(date);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#151C2C] text-gray-200">
      {/* Trainers List */}
      <div className="w-80 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search trainers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1A2234] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredTrainers.map((trainer) => (
            <div
              key={trainer.id}
              onClick={() => setSelectedTrainer(trainer)}
              className={`p-4 cursor-pointer transition-colors ${
                selectedTrainer?.id === trainer.id
                  ? "bg-[#1A2234]"
                  : "hover:bg-[#1A2234]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {trainer.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#151C2C] ${
                    trainer.status === "online" ? "bg-green-500" : "bg-gray-500"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">{trainer.name}</h3>
                      <p className="text-xs text-gray-400">{trainer.specialty}</p>
                    </div>
                    {trainer.lastMessage && (
                      <span className="text-xs text-gray-400">
                        {formatMessageTime(trainer.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  {trainer.lastMessage && (
                    <p className="text-sm text-gray-400 line-clamp-1 mt-1">
                      {trainer.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedTrainer ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {selectedTrainer.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#151C2C] ${
                    selectedTrainer.status === "online" ? "bg-green-500" : "bg-gray-500"
                  }`} />
                </div>
                <div>
                  <h2 className="text-white font-medium">{selectedTrainer.name}</h2>
                  <p className="text-sm text-gray-400">
                    {selectedTrainer.status === "online" ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors">
                  <Info className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-[#1A2234] rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "member" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.sender === "member"
                          ? "bg-blue-600 text-white"
                          : "bg-[#1A2234] text-gray-200"
                      } rounded-lg px-4 py-2`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a trainer to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
