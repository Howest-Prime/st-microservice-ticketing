import { assertEquals, assertThrows } from '@std/assert';
import { ExpiryDate, InvalidExpiryDateException } from '@/Domain/Ticketing/Payment/mod.ts';

Deno.test('[Unit] - ExpiryDate - create - valid month and year - returns value object', () => {
    // Act
    const expiryDate = ExpiryDate.create(12, 2028);

    // Assert
    assertEquals(expiryDate.expiryMonth, 12);
    assertEquals(expiryDate.expiryYear, 2028);
});

Deno.test('[Unit] - ExpiryDate - create - month 1 (January) - returns value object', () => {
    // Act
    const expiryDate = ExpiryDate.create(1, 2030);

    // Assert
    assertEquals(expiryDate.expiryMonth, 1);
    assertEquals(expiryDate.expiryYear, 2030);
});

Deno.test('[Unit] - ExpiryDate - create - month 0 (invalid) - throws InvalidExpiryDateException', () => {
    // Act & Assert
    assertThrows(
        () => ExpiryDate.create(0, 2028),
        InvalidExpiryDateException,
    );
});

Deno.test('[Unit] - ExpiryDate - create - month 13 (invalid) - throws InvalidExpiryDateException', () => {
    // Act & Assert
    assertThrows(
        () => ExpiryDate.create(13, 2028),
        InvalidExpiryDateException,
    );
});

Deno.test('[Unit] - ExpiryDate - create - NaN month - throws InvalidExpiryDateException', () => {
    // Act & Assert
    assertThrows(
        () => ExpiryDate.create(NaN, 2028),
        InvalidExpiryDateException,
    );
});

Deno.test('[Unit] - ExpiryDate - createFromDate - valid date - extracts month and year', () => {
    // Arrange
    const date = new Date('2028-06-15T00:00:00Z');

    // Act
    const expiryDate = ExpiryDate.createFromDate(date);

    // Assert
    assertEquals(expiryDate.expiryMonth, 6);
    assertEquals(expiryDate.expiryYear, 2028);
});

Deno.test('[Unit] - ExpiryDate - expiryDateString - formats as MM/YY', () => {
    // Arrange
    const expiryDate = ExpiryDate.create(6, 2028);

    // Act
    const result = expiryDate.expiryDateString();

    // Assert
    assertEquals(result, '06/28');
});

Deno.test('[Unit] - ExpiryDate - expiryDateString - pads single-digit month with zero', () => {
    // Arrange
    const expiryDate = ExpiryDate.create(3, 2030);

    // Act
    const result = expiryDate.expiryDateString();

    // Assert
    assertEquals(result, '03/30');
});

Deno.test('[Unit] - ExpiryDate - equals - same month and year - returns true', () => {
    // Arrange
    const left = ExpiryDate.create(12, 2028);
    const right = ExpiryDate.create(12, 2028);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - ExpiryDate - equals - different month - returns false', () => {
    // Arrange
    const left = ExpiryDate.create(11, 2028);
    const right = ExpiryDate.create(12, 2028);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - ExpiryDate - equals - different year - returns false', () => {
    // Arrange
    const left = ExpiryDate.create(12, 2027);
    const right = ExpiryDate.create(12, 2028);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
