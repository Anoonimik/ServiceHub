export class Provider {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly businessName: string | null,
    public readonly description: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get displayName(): string {
    return this.businessName || 'Provider';
  }
}

