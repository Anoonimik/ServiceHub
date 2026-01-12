export class Service {
  constructor(
    public readonly id: number,
    public readonly providerId: number,
    public readonly name: string,
    public readonly description: string | null,
    public readonly duration: number,
    public readonly price: number,
    public readonly isActive: boolean,
    public readonly allowCustomTime: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  isAvailable(): boolean {
    return this.isActive;
  }
}

