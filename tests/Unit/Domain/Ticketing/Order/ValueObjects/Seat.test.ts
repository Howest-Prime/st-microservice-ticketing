import { assertEquals, assertThrows } from '@std/assert';
import { InvalidSeatException, Seat, VisitorTypeLabel } from '@/Domain/Ticketing/Order/mod.ts';

Deno.test('[Unit] - Seat - create - valid standard seat - returns value object with correct properties', () => {
    // Act
    const seat = Seat.create(5, VisitorTypeLabel.Standard);

    // Assert
    assertEquals(seat.seatNumber, 5);
    assertEquals(seat.seatVisitorType, VisitorTypeLabel.Standard);
});

Deno.test('[Unit] - Seat - create - valid discounted seat - returns value object with correct properties', () => {
    // Act
    const seat = Seat.create(10, VisitorTypeLabel.Discounted);

    // Assert
    assertEquals(seat.seatNumber, 10);
    assertEquals(seat.seatVisitorType, VisitorTypeLabel.Discounted);
});

Deno.test('[Unit] - Seat - create - seat number zero - throws InvalidSeatException', () => {
    // Act & Assert
    assertThrows(
        () => Seat.create(0, VisitorTypeLabel.Standard),
        InvalidSeatException,
    );
});

Deno.test('[Unit] - Seat - create - negative seat number - throws InvalidSeatException', () => {
    // Act & Assert
    assertThrows(
        () => Seat.create(-1, VisitorTypeLabel.Standard),
        InvalidSeatException,
    );
});

Deno.test('[Unit] - Seat - equals - same seat number and visitor type - returns true', () => {
    // Arrange
    const left = Seat.create(3, VisitorTypeLabel.Standard);
    const right = Seat.create(3, VisitorTypeLabel.Standard);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - Seat - equals - different seat number - returns false', () => {
    // Arrange
    const left = Seat.create(3, VisitorTypeLabel.Standard);
    const right = Seat.create(4, VisitorTypeLabel.Standard);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - Seat - equals - different visitor type - returns false', () => {
    // Arrange
    const left = Seat.create(3, VisitorTypeLabel.Standard);
    const right = Seat.create(3, VisitorTypeLabel.Discounted);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
