export class TimeSlot {
  constructor(
    public readonly id: number,
    public readonly serviceId: number,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly isAvailable: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  isInPast(): boolean {
    return this.startTime < new Date();
  }

  isAvailableForBooking(): boolean {
    return this.isAvailable && !this.isInPast();
  }

  overlapsWith(start: Date, end: Date): boolean {
    return this.startTime < end && this.endTime > start;
  }
}

