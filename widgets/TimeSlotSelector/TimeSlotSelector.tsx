'use client';

import React, { useState, useEffect } from 'react';
import { timeSlotApi } from '@/entities/time-slot/api/timeSlotApi';
import { TimeSlot } from '@/entities/time-slot/model/types';
import { LoadingSpinner, ErrorMessage } from '@/shared/ui';

interface TimeSlotSelectorProps {
  serviceId: number | null;
  selectedSlotId: number | null;
  onSlotSelect: (slotId: number, startTime: string) => void;
  startDate?: string;
  endDate?: string;
}

export const TimeSlotSelector = ({
  serviceId,
  selectedSlotId,
  onSlotSelect,
  startDate,
  endDate,
}: TimeSlotSelectorProps) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (serviceId) {
      fetchSlots();
    } else {
      setSlots([]);
    }
  }, [serviceId, startDate, endDate]);

  const fetchSlots = async () => {
    if (!serviceId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await timeSlotApi.getByServiceId(serviceId, startDate, endDate);
      setSlots(data);
    } catch (err: any) {
      console.error('Error fetching time slots:', err);
      setError(err.message || 'Failed to load available time slots');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  if (!serviceId) {
    return (
      <div className="text-sm text-gray-500 italic">
        Please select a service first to see available time slots
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner size="sm" />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (slots.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No available time slots for this service. Please contact the provider.
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const slotsByDate = slots.reduce((acc, slot) => {
    const date = new Date(slot.startTime).toLocaleDateString('en-US');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="space-y-4">
      {Object.entries(slotsByDate).map(([date, dateSlots]) => (
        <div key={date} className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">{date}</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {dateSlots.map((slot) => {
              const isBooked = slot.isBooked || false;
              const isSelected = selectedSlotId === slot.id;
              const isDisabled = isBooked || !slot.isAvailable;

              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => !isDisabled && onSlotSelect(slot.id, slot.startTime)}
                  disabled={isDisabled}
                  className={`
                    px-3 py-2 text-sm rounded-lg border transition-all
                    ${isSelected
                      ? 'bg-primary-600 text-white border-primary-600'
                      : isDisabled
                      ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed line-through'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                    }
                  `}
                  title={isBooked ? 'This time slot is already booked' : formatDateTime(slot.startTime)}
                >
                  <div className="text-xs font-medium">
                    {new Date(slot.startTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  {isBooked && (
                    <div className="text-xs mt-1 opacity-75">Booked</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

