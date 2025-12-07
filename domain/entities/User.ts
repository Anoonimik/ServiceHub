export class User {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone: string | null,
    public readonly role: 'user' | 'admin' | 'provider',
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isProvider(): boolean {
    return this.role === 'provider';
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }
}

