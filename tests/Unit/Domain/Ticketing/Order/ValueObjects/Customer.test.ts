import { assertEquals } from '@std/assert';
import {
    Customer,
    CustomerEmail,
    CustomerSalutation,
    FirstName,
    LastName,
} from '@/Domain/Ticketing/Order/mod.ts';

const makeCustomer = () =>
    Customer.create(
        CustomerSalutation.create('Mr.'),
        FirstName.create('John'),
        LastName.create('Doe'),
        CustomerEmail.create('john.doe@example.com'),
    );

Deno.test('[Unit] - Customer - create - valid input - returns value object with correct properties', () => {
    // Act
    const customer = makeCustomer();

    // Assert
    assertEquals(customer.salutation.value, 'Mr.');
    assertEquals(customer.firstName.name, 'John');
    assertEquals(customer.lastName.name, 'Doe');
    assertEquals(customer.email.value, 'john.doe@example.com');
});

Deno.test('[Unit] - Customer - equals - same properties - returns true', () => {
    // Arrange
    const left = makeCustomer();
    const right = makeCustomer();

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - Customer - equals - different email - returns false', () => {
    // Arrange
    const left = makeCustomer();
    const right = Customer.create(
        CustomerSalutation.create('Mr.'),
        FirstName.create('John'),
        LastName.create('Doe'),
        CustomerEmail.create('other@example.com'),
    );

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - Customer - equals - different first name - returns false', () => {
    // Arrange
    const left = makeCustomer();
    const right = Customer.create(
        CustomerSalutation.create('Mr.'),
        FirstName.create('Jane'),
        LastName.create('Doe'),
        CustomerEmail.create('john.doe@example.com'),
    );

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - Customer - equals - different salutation - returns false', () => {
    // Arrange
    const left = makeCustomer();
    const right = Customer.create(
        CustomerSalutation.create('Ms.'),
        FirstName.create('John'),
        LastName.create('Doe'),
        CustomerEmail.create('john.doe@example.com'),
    );

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
