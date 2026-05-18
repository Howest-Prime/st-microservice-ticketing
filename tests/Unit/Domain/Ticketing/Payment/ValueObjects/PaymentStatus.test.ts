import { assertEquals, assertThrows } from '@std/assert';
import {
    InvalidPaymentTransitionException,
    PaymentStatus,
} from '@/Domain/Ticketing/Payment/mod.ts';
import { PaymentStatusState } from '@/Domain/Ticketing/Payment/ValueObjects/PaymentStatus.ts';

Deno.test('[Unit] - PaymentStatus - create - Pending state - returns value object', () => {
    // Act
    const status = PaymentStatus.create(PaymentStatusState.Pending);

    // Assert
    assertEquals(status.value, PaymentStatusState.Pending);
    assertEquals(status.toString(), 'Pending');
});

Deno.test('[Unit] - PaymentStatus - create - Success state - returns value object', () => {
    // Act
    const status = PaymentStatus.create(PaymentStatusState.Success);

    // Assert
    assertEquals(status.value, PaymentStatusState.Success);
});

Deno.test('[Unit] - PaymentStatus - create - Failed state - returns value object', () => {
    // Act
    const status = PaymentStatus.create(PaymentStatusState.Failed);

    // Assert
    assertEquals(status.value, PaymentStatusState.Failed);
});

Deno.test('[Unit] - PaymentStatus - createFromString - pending lowercase - returns Pending status', () => {
    // Act
    const status = PaymentStatus.createFromString('pending');

    // Assert
    assertEquals(status.value, PaymentStatusState.Pending);
});

Deno.test('[Unit] - PaymentStatus - createFromString - invalid string - throws InvalidPaymentStatusException', () => {
    // Act & Assert
    assertThrows(
        () => PaymentStatus.createFromString('unknown'),
        Error,
    );
});

Deno.test('[Unit] - PaymentStatus - transitionTo - Pending to Success - returns Success status', () => {
    // Arrange
    const pending = PaymentStatus.Pending;

    // Act
    const result = pending.transitionTo(PaymentStatus.Success);

    // Assert
    assertEquals(result.value, PaymentStatusState.Success);
});

Deno.test('[Unit] - PaymentStatus - transitionTo - Pending to Failed - returns Failed status', () => {
    // Arrange
    const pending = PaymentStatus.Pending;

    // Act
    const result = pending.transitionTo(PaymentStatus.Failed);

    // Assert
    assertEquals(result.value, PaymentStatusState.Failed);
});

Deno.test('[Unit] - PaymentStatus - transitionTo - Success to Failed - throws InvalidPaymentTransitionException', () => {
    // Arrange
    const success = PaymentStatus.Success;

    // Act & Assert
    assertThrows(
        () => success.transitionTo(PaymentStatus.Failed),
        InvalidPaymentTransitionException,
    );
});

Deno.test('[Unit] - PaymentStatus - transitionTo - Failed to Success - throws InvalidPaymentTransitionException', () => {
    // Arrange
    const failed = PaymentStatus.Failed;

    // Act & Assert
    assertThrows(
        () => failed.transitionTo(PaymentStatus.Success),
        InvalidPaymentTransitionException,
    );
});

Deno.test('[Unit] - PaymentStatus - static singletons - have correct values', () => {
    // Assert
    assertEquals(PaymentStatus.Pending.value, PaymentStatusState.Pending);
    assertEquals(PaymentStatus.Success.value, PaymentStatusState.Success);
    assertEquals(PaymentStatus.Failed.value, PaymentStatusState.Failed);
});

Deno.test('[Unit] - PaymentStatus - equals - same state - returns true', () => {
    // Arrange
    const left = PaymentStatus.Pending;
    const right = PaymentStatus.create(PaymentStatusState.Pending);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - PaymentStatus - equals - different states - returns false', () => {
    // Arrange
    const left = PaymentStatus.Pending;
    const right = PaymentStatus.Success;

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - PaymentStatus - createFromString - Success - returns Success status', () => {
    // Act
    const status = PaymentStatus.createFromString('success');

    // Assert
    assertEquals(status.value, PaymentStatusState.Success);
});

Deno.test('[Unit] - PaymentStatus - createFromString - Failed - returns Failed status', () => {
    // Act
    const status = PaymentStatus.createFromString('failed');

    // Assert
    assertEquals(status.value, PaymentStatusState.Failed);
});

Deno.test('[Unit] - PaymentStatus - createFromString - mixed case - returns correct status', () => {
    // Act
    const status = PaymentStatus.createFromString('Pending');

    // Assert
    assertEquals(status.value, PaymentStatusState.Pending);
});

Deno.test('[Unit] - PaymentStatus - toString - Success and Failed - return correct strings', () => {
    // Assert
    assertEquals(PaymentStatus.Success.toString(), 'Success');
    assertEquals(PaymentStatus.Failed.toString(), 'Failed');
});

Deno.test('[Unit] - PaymentStatus - equals - non PaymentStatus value - returns false', () => {
    // Arrange
    const status = PaymentStatus.Pending;

    // Act
    const result = status.equals({} as unknown as PaymentStatus);

    // Assert
    assertEquals(result, false);
});
