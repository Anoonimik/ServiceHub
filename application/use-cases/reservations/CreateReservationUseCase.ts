import { IReservationRepository, CreateReservationData } from '@/domain/repositories/IReservationRepository';
import { IServiceRepository } from '@/domain/repositories/IServiceRepository';
import { ICustomerRepository, CreateCustomerData, UpdateCustomerData } from '@/domain/repositories/ICustomerRepository';
import { ITimeSlotRepository } from '@/domain/repositories/ITimeSlotRepository';
import { CreateReservationDTO } from '@/application/dtos/ReservationDTO';
import { Reservation } from '@/domain/entities/Reservation';
import { ApiError } from '@/shared/lib/api/response';
import { executeQuery } from '@/shared/lib/api/db-helpers';

export class CreateReservationUseCase {
  constructor(
    private reservationRepository: IReservationRepository,
    private serviceRepository: IServiceRepository,
    private customerRepository: ICustomerRepository,
    private timeSlotRepository: ITimeSlotRepository
  ) {}

  /**
   * Execute reservation creation use case
   * @param userId - User ID (null for guest reservations)
   * @param dto - Reservation creation data
   * @returns Created reservation entity
   */
  async execute(userId: number | null, dto: CreateReservationDTO): Promise<Reservation> {
    const service = await this.serviceRepository.findById(dto.serviceId);
    if (!service) {
      throw new ApiError(404, 'Service not found');
    }

    if (!service.isAvailable()) {
      throw new ApiError(400, 'Service is not available');
    }

    if (dto.timeSlotId) {
      const timeSlot = await this.timeSlotRepository.findById(dto.timeSlotId);
      if (!timeSlot) {
        throw new ApiError(404, 'Time slot not found');
      }

      if (timeSlot.serviceId !== dto.serviceId) {
        throw new ApiError(400, 'Time slot does not belong to the selected service');
      }

      if (!timeSlot.isAvailableForBooking()) {
        throw new ApiError(400, 'Time slot is not available for booking');
      }

      const conflictingReservations = await executeQuery(`
        SELECT r.id
        FROM reservations r
        WHERE r.service_id = ?
          AND r.status IN ('pending', 'confirmed')
          AND r.reservation_date >= ?
          AND r.reservation_date < ?
        LIMIT 1
      `, [dto.serviceId, timeSlot.startTime, timeSlot.endTime]);

      if (conflictingReservations && conflictingReservations.length > 0) {
        throw new ApiError(400, 'Time slot is already booked');
      }
    }

    let customer = await this.customerRepository.findByPhone(dto.phone);
    
    if (customer) {
      const updateData: UpdateCustomerData = {};
      if (dto.email) updateData.email = dto.email;
      if (dto.firstName) updateData.firstName = dto.firstName;
      if (dto.lastName) updateData.lastName = dto.lastName;
      if (userId) updateData.userId = userId;

      if (Object.keys(updateData).length > 0) {
        customer = await this.customerRepository.update(customer.id, updateData);
      }
    } else {
      const customerData: CreateCustomerData = {
        userId: userId || null,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email || null,
        phone: dto.phone,
      };
      customer = await this.customerRepository.create(customerData);
    }

    const reservationData: CreateReservationData = {
      customerId: customer.id,
      serviceId: dto.serviceId,
      userId: userId || null,
      reservationDate: new Date(dto.reservationDate),
      notes: dto.notes || null,
      status: 'pending',
    };

    return await this.reservationRepository.create(reservationData);
  }
}

