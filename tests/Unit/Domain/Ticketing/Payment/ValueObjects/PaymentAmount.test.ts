import { assertEquals, assertThrows } from '@std/assert';
import { InvalidPaymentAmountException, PaymentAmount } from '@/Domain/Ticketing/Payment/mod.ts';

Deno.test('[Unit] - PaymentAmount - create - valid positive amount - returns value object', () => {
    // Act
    const amount = PaymentAmount.create(99.99);

    // Assert
    assertEquals(amount.amount, 99.99);
});

Deno.test('[Unit] - PaymentAmount - create - minimum positive amount - returns value object', () => {
    // Act
    const amount = PaymentAmount.create(0.01);

    // Assert
    assertEquals(amount.amount, 0.01);
});

Deno.test('[Unit] - PaymentAmount - create - zero amount - throws InvalidPaymentAmountException', () => {
    // Act & Assert
    assertThrows(
        () => PaymentAmount.create(0),
        InvalidPaymentAmountException,
    );
});

Deno.test('[Unit] - PaymentAmount - create - negative amount - throws InvalidPaymentAmountException', () => {
    // Act & Assert
    assertThrows(
        () => PaymentAmount.create(-10),
        InvalidPaymentAmountException,
    );
});

Deno.test('[Unit] - PaymentAmount - create - NaN amount - throws InvalidPaymentAmountException', () => {
    // Act & Assert
    assertThrows(
        () => PaymentAmount.create(NaN),
        InvalidPaymentAmountException,
    );
});

Deno.test('[Unit] - PaymentAmount - create - Infinity amount - throws InvalidPaymentAmountException', () => {
    // Act & Assert
    assertThrows(
        () => PaymentAmount.create(Infinity),
        InvalidPaymentAmountException,
    );
});

Deno.test('[Unit] - PaymentAmount - equals - same amount - returns true', () => {
    // Arrange
    const left = PaymentAmount.create(50);
    const right = PaymentAmount.create(50);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - PaymentAmount - equals - different amounts - returns false', () => {
    // Arrange
    const left = PaymentAmount.create(50);
    const right = PaymentAmount.create(75);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
