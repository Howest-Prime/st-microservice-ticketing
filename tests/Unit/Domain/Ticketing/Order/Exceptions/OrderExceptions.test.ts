import { assertEquals } from '@std/assert';
import {
    AlreadyHasTicketsException,
    DuplicateSeatException,
    InvalidTicketCountException,
} from '@/Domain/Ticketing/Order/mod.ts';

Deno.test('[Unit] - DuplicateSeatException - constructor - creates exception with correct message', () => {
    // Act
    const exception = new DuplicateSeatException(5);

    // Assert
    assertEquals(exception.message, 'Seat number 5 appears more than once in the order.');
    assertEquals(exception instanceof Error, true);
});

Deno.test('[Unit] - DuplicateSeatException - constructor - different seat number - reflects in message', () => {
    // Act
    const exception = new DuplicateSeatException(12);

    // Assert
    assertEquals(exception.message, 'Seat number 12 appears more than once in the order.');
});

Deno.test('[Unit] - AlreadyHasTicketsException - constructor - creates exception with correct message', () => {
    // Act
    const exception = new AlreadyHasTicketsException();

    // Assert
    assertEquals(exception.message, 'Order already has tickets assigned to it.');
    assertEquals(exception instanceof Error, true);
});

Deno.test('[Unit] - InvalidTicketCountException - constructor - creates exception with correct message', () => {
    // Act
    const exception = new InvalidTicketCountException(3, 2);

    // Assert
    assertEquals(exception.message, 'Expected 3 ticket(s) based on visitor count, but got 2.');
    assertEquals(exception instanceof Error, true);
});

Deno.test('[Unit] - InvalidTicketCountException - constructor - zero expected - reflects in message', () => {
    // Act
    const exception = new InvalidTicketCountException(0, 1);

    // Assert
    assertEquals(exception.message, 'Expected 0 ticket(s) based on visitor count, but got 1.');
});
