import React from 'react';
import { Input } from '@/shared/ui';
import { Service } from '@/entities/service/model/types';

interface AppointmentDetailsFormProps {
  formData: {
    service_id: string;
    reservation_date: string;
    notes: string;
  };
  services: Service[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const AppointmentDetailsForm = ({
  formData,
  services,
  onChange,
}: AppointmentDetailsFormProps) => {
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

      <Input
        label="Date & Time"
        type="datetime-local"
        name="reservation_date"
        value={formData.reservation_date}
        onChange={onChange}
        required
      />

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

