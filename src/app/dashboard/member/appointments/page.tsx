"use client";

import React from 'react';
import Appointments from '../components/appointments';

export default function AppointmentsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Appointments</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Appointments />
      </div>
    </div>
  );
}
