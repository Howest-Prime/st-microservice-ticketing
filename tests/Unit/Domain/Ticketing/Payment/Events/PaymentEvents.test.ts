import { assertEquals } from '@std/assert';
import { PaymentFailed, PaymentSucceeeded } from '@/Domain/Ticketing/Payment/mod.ts';

Deno.test('[Unit] - PaymentFailed - create - returns event with correct properties', () => {
    // Act
    const event = PaymentFailed.create('pay-001', 'order-001', 'booking-001', 'Card declined');

    // Assert
    assertEquals(event.paymentId, 'pay-001');
    assertEquals(event.orderId, 'order-001');
    assertEquals(event.bookingId, 'booking-001');
    assertEquals(event.reason, 'Card declined');
    assertEquals(event.occurredOn instanceof Date, true);
});

Deno.test('[Unit] - PaymentFailed - FQDN - instance getter - returns static FQDN', () => {
    // Arrange
    const event = PaymentFailed.create('pay-001', 'order-001', 'booking-001', 'Declined');

    // Assert
    assertEquals(event.FQDN, PaymentFailed.FQDN);
    assertEquals(typeof event.FQDN.value, 'string');
    assertEquals(event.FQDN.value.includes('paymentfailed'), true);
});

Deno.test('[Unit] - PaymentSucceeeded - create - returns event with correct properties', () => {
    // Act
    const event = PaymentSucceeeded.create('pay-001', 'order-001', 'booking-001');

    // Assert
    assertEquals(event.paymentId, 'pay-001');
    assertEquals(event.orderId, 'order-001');
    assertEquals(event.bookingId, 'booking-001');
    assertEquals(event.occurredOn instanceof Date, true);
});

Deno.test('[Unit] - PaymentSucceeeded - FQDN - instance getter - returns static FQDN', () => {
    // Arrange
    const event = PaymentSucceeeded.create('pay-001', 'order-001', 'booking-001');

    // Assert
    assertEquals(event.FQDN, PaymentSucceeeded.FQDN);
    assertEquals(typeof event.FQDN.value, 'string');
    assertEquals(event.FQDN.value.length > 0, true);
});
