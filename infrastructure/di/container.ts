import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IServiceRepository } from '@/domain/repositories/IServiceRepository';
import { IReservationRepository } from '@/domain/repositories/IReservationRepository';
import { IProviderRepository } from '@/domain/repositories/IProviderRepository';
import { ICustomerRepository } from '@/domain/repositories/ICustomerRepository';
import { IPasswordHasher } from '@/application/interfaces/IPasswordHasher';
import { IPasswordVerifier } from '@/application/interfaces/IPasswordVerifier';
import { ITokenGenerator } from '@/application/interfaces/ITokenGenerator';

import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { ServiceRepository } from '@/infrastructure/repositories/ServiceRepository';
import { ReservationRepository } from '@/infrastructure/repositories/ReservationRepository';
import { ProviderRepository } from '@/infrastructure/repositories/ProviderRepository';
import { CustomerRepository } from '@/infrastructure/repositories/CustomerRepository';
import { PasswordHasher } from '@/infrastructure/services/PasswordHasher';
import { PasswordVerifier } from '@/infrastructure/services/PasswordVerifier';
import { TokenGenerator } from '@/infrastructure/services/TokenGenerator';

import { RegisterUserUseCase } from '@/application/use-cases/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '@/application/use-cases/auth/LoginUserUseCase';
import { CreateServiceUseCase } from '@/application/use-cases/services/CreateServiceUseCase';
import { CreateReservationUseCase } from '@/application/use-cases/reservations/CreateReservationUseCase';
import { CreateProviderUseCase } from '@/application/use-cases/providers/CreateProviderUseCase';

class DIContainer {
  // Repositories (singletons)
  private _userRepository: IUserRepository | null = null;
  private _serviceRepository: IServiceRepository | null = null;
  private _reservationRepository: IReservationRepository | null = null;
  private _providerRepository: IProviderRepository | null = null;
  private _customerRepository: ICustomerRepository | null = null;

  // Services (singletons)
  private _passwordHasher: IPasswordHasher | null = null;
  private _passwordVerifier: IPasswordVerifier | null = null;
  private _tokenGenerator: ITokenGenerator | null = null;

  // Use Cases (singletons)
  private _registerUserUseCase: RegisterUserUseCase | null = null;
  private _loginUserUseCase: LoginUserUseCase | null = null;
  private _createServiceUseCase: CreateServiceUseCase | null = null;
  private _createReservationUseCase: CreateReservationUseCase | null = null;
  private _createProviderUseCase: CreateProviderUseCase | null = null;

  get userRepository(): IUserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository();
    }
    return this._userRepository;
  }

  get serviceRepository(): IServiceRepository {
    if (!this._serviceRepository) {
      this._serviceRepository = new ServiceRepository();
    }
    return this._serviceRepository;
  }

  get reservationRepository(): IReservationRepository {
    if (!this._reservationRepository) {
      this._reservationRepository = new ReservationRepository();
    }
    return this._reservationRepository;
  }

  get providerRepository(): IProviderRepository {
    if (!this._providerRepository) {
      this._providerRepository = new ProviderRepository();
    }
    return this._providerRepository;
  }

  get customerRepository(): ICustomerRepository {
    if (!this._customerRepository) {
      this._customerRepository = new CustomerRepository();
    }
    return this._customerRepository;
  }

  get passwordHasher(): IPasswordHasher {
    if (!this._passwordHasher) {
      this._passwordHasher = new PasswordHasher();
    }
    return this._passwordHasher;
  }

  get passwordVerifier(): IPasswordVerifier {
    if (!this._passwordVerifier) {
      this._passwordVerifier = new PasswordVerifier();
    }
    return this._passwordVerifier;
  }

  get tokenGenerator(): ITokenGenerator {
    if (!this._tokenGenerator) {
      this._tokenGenerator = new TokenGenerator();
    }
    return this._tokenGenerator;
  }

  get registerUserUseCase(): RegisterUserUseCase {
    if (!this._registerUserUseCase) {
      this._registerUserUseCase = new RegisterUserUseCase(
        this.userRepository,
        this.passwordHasher,
        this.tokenGenerator
      );
    }
    return this._registerUserUseCase;
  }

  get loginUserUseCase(): LoginUserUseCase {
    if (!this._loginUserUseCase) {
      this._loginUserUseCase = new LoginUserUseCase(
        this.userRepository,
        this.passwordVerifier,
        this.tokenGenerator
      );
    }
    return this._loginUserUseCase;
  }

  get createServiceUseCase(): CreateServiceUseCase {
    if (!this._createServiceUseCase) {
      this._createServiceUseCase = new CreateServiceUseCase(
        this.serviceRepository,
        this.providerRepository
      );
    }
    return this._createServiceUseCase;
  }

  get createReservationUseCase(): CreateReservationUseCase {
    if (!this._createReservationUseCase) {
      this._createReservationUseCase = new CreateReservationUseCase(
        this.reservationRepository,
        this.serviceRepository,
        this.customerRepository
      );
    }
    return this._createReservationUseCase;
  }

  get createProviderUseCase(): CreateProviderUseCase {
    if (!this._createProviderUseCase) {
      this._createProviderUseCase = new CreateProviderUseCase(
        this.providerRepository,
        this.userRepository
      );
    }
    return this._createProviderUseCase;
  }
}

export const container = new DIContainer();

