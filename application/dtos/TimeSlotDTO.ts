export interface CreateTimeSlotDTO {
  serviceId: number;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
}

export interface TimeSlotResponseDTO {
  id: number;
  serviceId: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  isBooked?: boolean;
}

