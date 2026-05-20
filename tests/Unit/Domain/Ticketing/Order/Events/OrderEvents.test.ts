import { assertEquals } from '@std/assert';
import { OrderPaid, TicketsReleased } from '@/Domain/Ticketing/Order/mod.ts';

Deno.test('[Unit] - OrderPaid - create - returns event with correct properties', () => {
    // Act
    const event = OrderPaid.create('order-id-001', 'booking-id-001');

    // Assert
    assertEquals(event.orderId, 'order-id-001');
    assertEquals(event.bookingId, 'booking-id-001');
    assertEquals(event.occurredOn instanceof Date, true);
});

Deno.test('[Unit] - OrderPaid - FQDN - instance getter - returns static FQDN', () => {
    // Arrange
    const event = OrderPaid.create('order-id-001', 'booking-id-001');

    // Assert
    assertEquals(event.FQDN, OrderPaid.FQDN);
    assertEquals(typeof event.FQDN.value, 'string');
    assertEquals(event.FQDN.value.includes('OrderPaid'), true);
});

Deno.test('[Unit] - OrderPaid - static FQDN - contains correct event name', () => {
    // Assert
    assertEquals(typeof OrderPaid.FQDN.value, 'string');
    assertEquals(OrderPaid.FQDN.value.length > 0, true);
});

Deno.test('[Unit] - TicketsReleased - create - with customer and tickets - returns event with correct properties', () => {
    // Arrange
    const customer = {
        salutation: 'Mr.',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
    };
    const tickets = [
        {
            ticketId: 'ticket-001',
            movieId: 'movie-001',
            room: 'Room A',
            seatNumber: 1,
            visitorType: 'Standard',
            price: 18,
            showtime: '2026-12-01T20:00:00.000Z',
        },
    ];

    // Act
    const event = TicketsReleased.create('order-id-001', customer, tickets);

    // Assert
    assertEquals(event.orderId, 'order-id-001');
    assertEquals(event.customer?.firstName, 'John');
    assertEquals(event.customer?.lastName, 'Doe');
    assertEquals(event.customer?.salutation, 'Mr.');
    assertEquals(event.customer?.email, 'john.doe@example.com');
    assertEquals(event.tickets.length, 1);
    assertEquals(event.tickets[0]!.seatNumber, 1);
    assertEquals(event.occurredOn instanceof Date, true);
});

Deno.test('[Unit] - TicketsReleased - create - with null customer - returns event with null customer', () => {
    // Act
    const event = TicketsReleased.create('order-id-001', null, []);

    // Assert
    assertEquals(event.customer, null);
    assertEquals(event.tickets.length, 0);
});

Deno.test('[Unit] - TicketsReleased - FQDN - instance getter - returns static FQDN', () => {
    // Arrange
    const event = TicketsReleased.create('order-id-001', null, []);

    // Assert
    assertEquals(event.FQDN, TicketsReleased.FQDN);
    assertEquals(typeof event.FQDN.value, 'string');
    assertEquals(event.FQDN.value.includes('ticketsreleased'), true);
});
