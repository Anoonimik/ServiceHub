export interface TimeSlot {
  id: number;
  serviceId: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
  isBooked?: boolean;
}

