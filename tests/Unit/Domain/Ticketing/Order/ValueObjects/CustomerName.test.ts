import { assertEquals, assertThrows } from '@std/assert';
import { FirstName, InvalidNameException, LastName } from '@/Domain/Ticketing/Order/mod.ts';

Deno.test('[Unit] - FirstName - create - valid name - returns value object with correct value', () => {
    // Act
    const firstName = FirstName.create('John');

    // Assert
    assertEquals(firstName.name, 'John');
});

Deno.test('[Unit] - FirstName - create - empty name - throws InvalidNameException', () => {
    // Act & Assert
    assertThrows(
        () => FirstName.create(''),
        InvalidNameException,
    );
});

Deno.test('[Unit] - FirstName - create - whitespace only name - throws InvalidNameException', () => {
    // Act & Assert
    assertThrows(
        () => FirstName.create('   '),
        InvalidNameException,
    );
});

Deno.test('[Unit] - FirstName - equals - same name - returns true', () => {
    // Arrange
    const left = FirstName.create('John');
    const right = FirstName.create('John');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - FirstName - equals - different names - returns false', () => {
    // Arrange
    const left = FirstName.create('John');
    const right = FirstName.create('Jane');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - LastName - create - valid name - returns value object with correct value', () => {
    // Act
    const lastName = LastName.create('Doe');

    // Assert
    assertEquals(lastName.name, 'Doe');
});

Deno.test('[Unit] - LastName - create - empty name - throws InvalidNameException', () => {
    // Act & Assert
    assertThrows(
        () => LastName.create(''),
        InvalidNameException,
    );
});

Deno.test('[Unit] - LastName - create - whitespace only name - throws InvalidNameException', () => {
    // Act & Assert
    assertThrows(
        () => LastName.create('   '),
        InvalidNameException,
    );
});

Deno.test('[Unit] - LastName - equals - same name - returns true', () => {
    // Arrange
    const left = LastName.create('Doe');
    const right = LastName.create('Doe');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - LastName - equals - different names - returns false', () => {
    // Arrange
    const left = LastName.create('Doe');
    const right = LastName.create('Smith');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
