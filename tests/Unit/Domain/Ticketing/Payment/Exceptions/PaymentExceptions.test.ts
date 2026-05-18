import { assertEquals } from '@std/assert';
import {
    AlreadyInStatusException,
    PaymentFailedException,
} from '@/Domain/Ticketing/Payment/mod.ts';

Deno.test('[Unit] - AlreadyInStatusException - constructor - creates exception with correct message', () => {
    // Act
    const exception = new AlreadyInStatusException('Pending');

    // Assert
    assertEquals(exception.message, "Payment is already in status 'Pending'");
    assertEquals(exception instanceof Error, true);
});

Deno.test('[Unit] - AlreadyInStatusException - constructor - different status - reflects in message', () => {
    // Act
    const exception = new AlreadyInStatusException('Success');

    // Assert
    assertEquals(exception.message, "Payment is already in status 'Success'");
});

Deno.test('[Unit] - PaymentFailedException - constructor - creates exception with correct message', () => {
    // Act
    const exception = new PaymentFailedException('pay-001', 'Insufficient funds');

    // Assert
    assertEquals(exception.message, 'Payment with ID pay-001 failed. Reason: Insufficient funds');
    assertEquals(exception instanceof Error, true);
});

Deno.test('[Unit] - PaymentFailedException - constructor - different reason - reflects in message', () => {
    // Act
    const exception = new PaymentFailedException('pay-002', 'Card expired');

    // Assert
    assertEquals(exception.message, 'Payment with ID pay-002 failed. Reason: Card expired');
});
