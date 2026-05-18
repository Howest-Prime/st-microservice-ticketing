import { assertEquals, assertThrows } from '@std/assert';
import { CVV, InvalidCVVException } from '@/Domain/Ticketing/Payment/mod.ts';

Deno.test('[Unit] - CVV - create - valid 3-digit CVV - returns value object', () => {
    // Act
    const cvv = CVV.create('123');

    // Assert
    assertEquals(cvv.cvv, '123');
});

Deno.test('[Unit] - CVV - create - valid 4-digit CVV - returns value object', () => {
    // Act
    const cvv = CVV.create('1234');

    // Assert
    assertEquals(cvv.cvv, '1234');
});

Deno.test('[Unit] - CVV - create - too short (2 digits) - throws InvalidCVVException', () => {
    // Act & Assert
    assertThrows(
        () => CVV.create('12'),
        InvalidCVVException,
    );
});

Deno.test('[Unit] - CVV - create - too long (5 digits) - throws InvalidCVVException', () => {
    // Act & Assert
    assertThrows(
        () => CVV.create('12345'),
        InvalidCVVException,
    );
});

Deno.test('[Unit] - CVV - create - empty string - throws InvalidCVVException', () => {
    // Act & Assert
    assertThrows(
        () => CVV.create(''),
        InvalidCVVException,
    );
});

Deno.test('[Unit] - CVV - equals - same CVV - returns true', () => {
    // Arrange
    const left = CVV.create('123');
    const right = CVV.create('123');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - CVV - equals - different CVVs - returns false', () => {
    // Arrange
    const left = CVV.create('123');
    const right = CVV.create('456');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
