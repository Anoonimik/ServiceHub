import { NextRequest } from 'next/server';
import { handleApiRoute } from '@/shared/lib/api/response';
import { optionalAuth } from '@/shared/lib/api/middleware';
import { validateRequired, validateString, validateDate, validatePhone, validateEmail } from '@/shared/lib/api/validators';
import { container } from '@/infrastructure/di/container';
import { executeQuery } from '@/shared/lib/api/db-helpers';

export async function GET() {
  return handleApiRoute(async () => {
    const reservations = await executeQuery(`
      SELECT 
        r.id,
        r.reservation_date,
        r.status,
        r.notes,
        c.first_name as customer_first_name,
        c.last_name as customer_last_name,
        c.email as customer_email,
        c.phone as customer_phone,
        s.name as service_name,
        s.price as service_price,
        s.duration as service_duration,
        sp.business_name as provider_business_name,
        u.first_name as provider_first_name,
        u.last_name as provider_last_name
      FROM reservations r
      INNER JOIN customers c ON r.customer_id = c.id
      INNER JOIN services s ON r.service_id = s.id
      LEFT JOIN service_providers sp ON s.provider_id = sp.id
      LEFT JOIN users u ON sp.user_id = u.id
      ORDER BY r.reservation_date DESC
      LIMIT 50
    `);
    
    return reservations;
  });
}

export async function POST(request: NextRequest) {
  return handleApiRoute(async () => {
    const body = await request.json();
    const {
      first_name,
      last_name,
      email,
      phone,
      service_id,
      reservation_date,
      notes,
    } = body;

    validateRequired(first_name, 'first_name');
    validateRequired(last_name, 'last_name');
    validateRequired(phone, 'phone');
    validateRequired(service_id, 'service_id');
    validateRequired(reservation_date, 'reservation_date');
    validateString(first_name, 'first_name', 1, 100);
    validateString(last_name, 'last_name', 1, 100);
    validatePhone(phone);
    validateDate(reservation_date, 'reservation_date');
    if (email) validateEmail(email);

    const user = await optionalAuth(request);
    const userId = user?.id || null;

    const reservation = await container.createReservationUseCase.execute(userId, {
      firstName: first_name,
      lastName: last_name,
      email,
      phone,
      serviceId: service_id,
      reservationDate: reservation_date,
      notes,
    });

    return {
      message: 'Reservation created successfully',
      id: reservation.id,
    };
  });
}
