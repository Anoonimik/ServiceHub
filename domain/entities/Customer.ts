export class Customer {
  constructor(
    public readonly id: number,
    public readonly userId: number | null,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string | null,
    public readonly phone: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

