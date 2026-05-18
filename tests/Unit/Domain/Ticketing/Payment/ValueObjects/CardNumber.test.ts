import { assertEquals, assertThrows } from '@std/assert';
import { CardNumber, InvalidCardNumberException } from '@/Domain/Ticketing/Payment/mod.ts';

Deno.test('[Unit] - CardNumber - create - valid 16-digit number - returns value object', () => {
    // Act
    const cardNumber = CardNumber.create('4111111111111111');

    // Assert
    assertEquals(cardNumber.cardNumber, '4111111111111111');
});

Deno.test('[Unit] - CardNumber - create - minimum 12-digit number - returns value object', () => {
    // Act
    const cardNumber = CardNumber.create('411111111111');

    // Assert
    assertEquals(cardNumber.cardNumber, '411111111111');
});

Deno.test('[Unit] - CardNumber - create - maximum 19-digit number - returns value object', () => {
    // Act
    const cardNumber = CardNumber.create('4111111111111111111');

    // Assert
    assertEquals(cardNumber.cardNumber, '4111111111111111111');
});

Deno.test('[Unit] - CardNumber - create - number too short (11 digits) - throws InvalidCardNumberException', () => {
    // Act & Assert
    assertThrows(
        () => CardNumber.create('41111111111'),
        InvalidCardNumberException,
    );
});

Deno.test('[Unit] - CardNumber - create - number too long (20 digits) - throws InvalidCardNumberException', () => {
    // Act & Assert
    assertThrows(
        () => CardNumber.create('41111111111111111111'),
        InvalidCardNumberException,
    );
});

Deno.test('[Unit] - CardNumber - create - empty string - throws InvalidCardNumberException', () => {
    // Act & Assert
    assertThrows(
        () => CardNumber.create(''),
        InvalidCardNumberException,
    );
});

Deno.test('[Unit] - CardNumber - equals - same number - returns true', () => {
    // Arrange
    const left = CardNumber.create('4111111111111111');
    const right = CardNumber.create('4111111111111111');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - CardNumber - equals - different numbers - returns false', () => {
    // Arrange
    const left = CardNumber.create('4111111111111111');
    const right = CardNumber.create('5500005555555559');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
