import { assertEquals, assertThrows } from '@std/assert';
import { CustomerEmail } from '@/Domain/Ticketing/Order/mod.ts';

Deno.test('[Unit] - CustomerEmail - create - valid email - returns CustomerEmail', () => {
    // Act
    const email = CustomerEmail.create('john.doe@example.com');

    // Assert
    assertEquals(email.value, 'john.doe@example.com');
});

Deno.test('[Unit] - CustomerEmail - create - invalid email - throws error', () => {
    // Act & Assert
    assertThrows(
        () => CustomerEmail.create('not-an-email'),
        Error,
    );
});

Deno.test('[Unit] - CustomerEmail - create - empty string - throws error', () => {
    // Act & Assert
    assertThrows(
        () => CustomerEmail.create(''),
        Error,
    );
});

Deno.test('[Unit] - CustomerEmail - value - returns email string', () => {
    // Arrange
    const email = CustomerEmail.create('jane.doe@example.com');

    // Assert
    assertEquals(email.value, 'jane.doe@example.com');
});

Deno.test('[Unit] - CustomerEmail - toString - returns email string', () => {
    // Arrange
    const email = CustomerEmail.create('john.doe@example.com');

    // Assert
    assertEquals(email.toString(), 'john.doe@example.com');
});

Deno.test('[Unit] - CustomerEmail - equals - same email - returns true', () => {
    // Arrange
    const left = CustomerEmail.create('john.doe@example.com');
    const right = CustomerEmail.create('john.doe@example.com');

    // Assert
    assertEquals(left.equals(right), true);
});

Deno.test('[Unit] - CustomerEmail - equals - different email - returns false', () => {
    // Arrange
    const left = CustomerEmail.create('john.doe@example.com');
    const right = CustomerEmail.create('jane.doe@example.com');

    // Assert
    assertEquals(left.equals(right), false);
});
