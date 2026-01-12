'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/shared/ui';
import { Service } from '@/entities/service/model/types';
import { TimeSlotSelector } from '@/widgets/TimeSlotSelector/TimeSlotSelector';

interface AppointmentDetailsFormProps {
  formData: {
    service_id: string;
    reservation_date: string;
    notes: string;
  };
  services: Service[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSlotSelect?: (slotId: number, startTime: string) => void;
  selectedSlotId?: number | null;
}

export const AppointmentDetailsForm = ({
  formData,
  services,
  onChange,
  onSlotSelect,
  selectedSlotId,
}: AppointmentDetailsFormProps) => {
  const serviceId = formData.service_id ? parseInt(formData.service_id) : null;
  const selectedService = services.find(s => s.id === serviceId);
  const allowCustomTime = selectedService?.allow_custom_time === true;
  const [useTimeSlots, setUseTimeSlots] = useState(true);
  
  useEffect(() => {
    if (serviceId && !allowCustomTime) {
      setUseTimeSlots(true);
    }
  }, [serviceId, allowCustomTime]);

  const handleSlotSelect = (slotId: number, startTime: string) => {
    if (onSlotSelect) {
      onSlotSelect(slotId, startTime);
    }
    const event = {
      target: {
        name: 'reservation_date',
        value: new Date(startTime).toISOString().slice(0, 16),
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div className="pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Appointment Details
      </h3>
      
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Service *
        </label>
        <select
          name="service_id"
          value={formData.service_id}
          onChange={onChange}
          required
          className="input"
        >
          <option value="">Select a service</option>
          {services.map((service: any) => (
            <option key={service.id} value={service.id}>
              {service.name} - ${service.price} ({service.duration} min)
              {service.business_name && ` - ${service.business_name}`}
            </option>
          ))}
        </select>
      </div>

      {serviceId && useTimeSlots ? (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Available Time Slots *
            </label>
            {allowCustomTime && (
              <button
                type="button"
                onClick={() => setUseTimeSlots(false)}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                Or enter custom time
              </button>
            )}
          </div>
          <TimeSlotSelector
            serviceId={serviceId}
            selectedSlotId={selectedSlotId || null}
            onSlotSelect={handleSlotSelect}
          />
          {selectedSlotId && (
            <input
              type="hidden"
              name="time_slot_id"
              value={selectedSlotId}
            />
          )}
        </div>
      ) : allowCustomTime ? (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Date & Time *
            </label>
            {serviceId && (
              <button
                type="button"
                onClick={() => setUseTimeSlots(true)}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                Use available slots
              </button>
            )}
          </div>
          <Input
            type="datetime-local"
            name="reservation_date"
            value={formData.reservation_date}
            onChange={onChange}
            required
          />
        </div>
      ) : serviceId ? (
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            Available Time Slots *
          </label>
          <TimeSlotSelector
            serviceId={serviceId}
            selectedSlotId={selectedSlotId || null}
            onSlotSelect={handleSlotSelect}
          />
          {selectedSlotId && (
            <input
              type="hidden"
              name="time_slot_id"
              value={selectedSlotId}
            />
          )}
        </div>
      ) : null}

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={onChange}
          rows={4}
          className="input resize-none"
          placeholder="Any special requests or notes..."
        />
      </div>
    </div>
  );
};

