import { TimeSlot } from '../entities/TimeSlot';

export interface ITimeSlotRepository {
  findById(id: number): Promise<TimeSlot | null>;
  findByServiceId(serviceId: number, startDate?: Date, endDate?: Date): Promise<TimeSlot[]>;
  findAvailableByServiceId(serviceId: number, startDate?: Date, endDate?: Date): Promise<TimeSlot[]>;
  create(timeSlotData: CreateTimeSlotData): Promise<TimeSlot>;
  update(id: number, timeSlotData: Partial<UpdateTimeSlotData>): Promise<TimeSlot>;
  delete(id: number): Promise<void>;
  markAsUnavailable(id: number): Promise<void>;
  markAsAvailable(id: number): Promise<void>;
}

export interface CreateTimeSlotData {
  serviceId: number;
  startTime: Date;
  endTime: Date;
  isAvailable?: boolean;
}

export interface UpdateTimeSlotData {
  startTime?: Date;
  endTime?: Date;
  isAvailable?: boolean;
}

