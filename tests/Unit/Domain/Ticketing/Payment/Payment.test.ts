import { assertEquals } from '@std/assert';
import {
    BookingId,
    CardNumber,
    CVV,
    ExpiryDate,
    ExternalId,
    OrderId,
    Payment,
    PaymentAmount,
    PaymentFailed,
    PaymentMethod,
    PaymentStatus,
    PaymentSucceeeded,
} from '@/Domain/Ticketing/Payment/mod.ts';
import { PaymentStatusState } from '@/Domain/Ticketing/Payment/ValueObjects/PaymentStatus.ts';

const makePayment = () =>
    Payment.create(
        ExternalId.create(),
        PaymentMethod.CreditCard,
        CardNumber.create('4111111111111111'),
        ExpiryDate.create(12, 2028),
        CVV.create('123'),
        OrderId.create(),
        BookingId.create(),
        'EXT-BOOKING-123',
        PaymentAmount.create(99.99),
    );

Deno.test('[Unit] - Payment - create - valid input - returns aggregate in Pending status', () => {
    // Act
    const payment = makePayment();

    // Assert
    assertEquals(payment.status.value, PaymentStatusState.Pending);
    assertEquals(payment.amount.amount, 99.99);
    assertEquals(payment.cardNumber.cardNumber, '4111111111111111');
    assertEquals(payment.cvv.cvv, '123');
});

Deno.test('[Unit] - Payment - create - two payments - have different ids', () => {
    // Act
    const first = makePayment();
    const second = makePayment();

    // Assert
    assertEquals(first.id.equals(second.id), false);
});

Deno.test('[Unit] - Payment - handlePayment - success true - transitions to Success status', () => {
    // Arrange
    const payment = makePayment();

    // Act
    payment.handlePayment(true);

    // Assert
    assertEquals(payment.status.value, PaymentStatusState.Success);
});

Deno.test('[Unit] - Payment - handlePayment - success true - raises PaymentSucceeeded event', () => {
    // Arrange
    const payment = makePayment();

    // Act
    payment.handlePayment(true);
    const events = payment.pullDomainEvents();

    // Assert
    assertEquals(events.length, 1);
    assertEquals(events[0] instanceof PaymentSucceeeded, true);
    const event = events[0] as PaymentSucceeeded;
    assertEquals(event.paymentId, payment.id.value);
    assertEquals(event.orderId, payment.orderId.value);
    assertEquals(event.bookingId, payment.externalBookingId);
    assertEquals(event.occurredOn instanceof Date, true);
});

Deno.test('[Unit] - Payment - handlePayment - success false - transitions to Failed status', () => {
    // Arrange
    const payment = makePayment();

    // Act
    payment.handlePayment(false, 'Insufficient funds');

    // Assert
    assertEquals(payment.status.value, PaymentStatusState.Failed);
});

Deno.test('[Unit] - Payment - handlePayment - success false - raises PaymentFailed event', () => {
    // Arrange
    const payment = makePayment();

    // Act
    payment.handlePayment(false, 'Card declined');
    const events = payment.pullDomainEvents();

    // Assert
    assertEquals(events.length, 1);
    assertEquals(events[0] instanceof PaymentFailed, true);
    const event = events[0] as PaymentFailed;
    assertEquals(event.paymentId, payment.id.value);
    assertEquals(event.orderId, payment.orderId.value);
    assertEquals(event.bookingId, payment.externalBookingId);
    assertEquals(event.reason, 'Card declined');
    assertEquals(event.occurredOn instanceof Date, true);
});

Deno.test('[Unit] - Payment - handlePayment - success false without reason - uses default reason', () => {
    // Arrange
    const payment = makePayment();

    // Act
    payment.handlePayment(false);
    const events = payment.pullDomainEvents();
    const event = events[0] as PaymentFailed;

    // Assert
    assertEquals(event.reason, 'Unknown reason');
});

Deno.test('[Unit] - Payment - markAsFailed - pending payment - transitions to Failed', () => {
    // Arrange
    const payment = makePayment();

    // Act
    payment.markAsFailed();

    // Assert
    assertEquals(payment.status.value, PaymentStatusState.Failed);
});

Deno.test('[Unit] - Payment - markAsSucceeded - pending payment - transitions to Success', () => {
    // Arrange
    const payment = makePayment();

    // Act
    payment.markAsSucceeded();

    // Assert
    assertEquals(payment.status.value, PaymentStatusState.Success);
});

Deno.test('[Unit] - Payment - getters - return correct value objects', () => {
    // Arrange
    const externalId = ExternalId.create();
    const orderId = OrderId.create();
    const bookingId = BookingId.create();
    const externalBookingId = 'EXT-BOOKING-456';
    const payment = Payment.create(
        externalId,
        PaymentMethod.BankTransfer,
        CardNumber.create('4111111111111111'),
        ExpiryDate.create(6, 2030),
        CVV.create('456'),
        orderId,
        bookingId,
        externalBookingId,
        PaymentAmount.create(150.00),
    );

    // Assert
    assertEquals(payment.externalId.value, externalId.value);
    assertEquals(payment.orderId.value, orderId.value);
    assertEquals(payment.bookingId.value, bookingId.value);
    assertEquals(payment.amount.amount, 150.00);
    assertEquals(payment.expiryDate.expiryMonth, 6);
    assertEquals(payment.expiryDate.expiryYear, 2030);
    assertEquals(payment.status, PaymentStatus.Pending);
});
