import { assertEquals, assertThrows } from '@std/assert';
import { InvalidMoney, Money } from '@/Domain/Ticketing/Shared/mod.ts';

Deno.test('[Unit] - Money - create - valid amount and currency - returns value object', () => {
    // Act
    const money = Money.create(10.99, 'EUR');

    // Assert
    assertEquals(money.amount, 10.99);
    assertEquals(money.currency, 'EUR');
});

Deno.test('[Unit] - Money - create - zero amount - returns value object', () => {
    // Act
    const money = Money.create(0, 'EUR');

    // Assert
    assertEquals(money.amount, 0);
});

Deno.test('[Unit] - Money - create - negative amount - throws InvalidMoney', () => {
    // Act & Assert
    assertThrows(
        () => Money.create(-1, 'EUR'),
        InvalidMoney,
    );
});

Deno.test('[Unit] - Money - create - currency too short - throws InvalidMoney', () => {
    // Act & Assert
    assertThrows(
        () => Money.create(10, 'EU'),
        InvalidMoney,
    );
});

Deno.test('[Unit] - Money - create - currency too long - throws InvalidMoney', () => {
    // Act & Assert
    assertThrows(
        () => Money.create(10, 'EURO'),
        InvalidMoney,
    );
});

Deno.test('[Unit] - Money - create - empty currency - throws InvalidMoney', () => {
    // Act & Assert
    assertThrows(
        () => Money.create(10, ''),
        InvalidMoney,
    );
});

Deno.test('[Unit] - Money - equals - same amount and currency - returns true', () => {
    // Arrange
    const left = Money.create(9.99, 'EUR');
    const right = Money.create(9.99, 'EUR');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - Money - equals - different amount - returns false', () => {
    // Arrange
    const left = Money.create(9.99, 'EUR');
    const right = Money.create(19.99, 'EUR');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - Money - equals - different currency - returns false', () => {
    // Arrange
    const left = Money.create(9.99, 'EUR');
    const right = Money.create(9.99, 'USD');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
