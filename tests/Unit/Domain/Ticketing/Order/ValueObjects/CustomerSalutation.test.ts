import { assertEquals, assertThrows } from '@std/assert';
import { InvalidCustomerSalutationException } from '@/Domain/Ticketing/Order/mod.ts';
import {
    CustomerSalutation,
    CustomerSalutationLabel,
} from '@/Domain/Ticketing/Order/ValueObjects/CostumerSalutation.ts';

Deno.test('[Unit] - CustomerSalutation - create - Mr. salutation - returns value object with correct value', () => {
    // Act
    const salutation = CustomerSalutation.create('Mr.');

    // Assert
    assertEquals(salutation.value, CustomerSalutationLabel.Mr);
});

Deno.test('[Unit] - CustomerSalutation - create - Ms. salutation - returns value object with correct value', () => {
    // Act
    const salutation = CustomerSalutation.create('Ms.');

    // Assert
    assertEquals(salutation.value, CustomerSalutationLabel.Ms);
});

Deno.test('[Unit] - CustomerSalutation - create - Mx. salutation - returns value object with correct value', () => {
    // Act
    const salutation = CustomerSalutation.create('Mx.');

    // Assert
    assertEquals(salutation.value, CustomerSalutationLabel.Mx);
});

Deno.test('[Unit] - CustomerSalutation - create - invalid salutation - throws InvalidCustomerSalutationException', () => {
    // Act & Assert
    assertThrows(
        () => CustomerSalutation.create('Dr.'),
        InvalidCustomerSalutationException,
    );
});

Deno.test('[Unit] - CustomerSalutation - create - empty string - throws InvalidCustomerSalutationException', () => {
    // Act & Assert
    assertThrows(
        () => CustomerSalutation.create(''),
        InvalidCustomerSalutationException,
    );
});

Deno.test('[Unit] - CustomerSalutation - equals - same salutation - returns true', () => {
    // Arrange
    const left = CustomerSalutation.create('Mr.');
    const right = CustomerSalutation.create('Mr.');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - CustomerSalutation - equals - different salutations - returns false', () => {
    // Arrange
    const left = CustomerSalutation.create('Mr.');
    const right = CustomerSalutation.create('Ms.');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
