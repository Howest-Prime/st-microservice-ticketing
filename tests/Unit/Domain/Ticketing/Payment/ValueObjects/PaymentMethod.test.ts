import { assertEquals, assertThrows } from '@std/assert';
import { InvalidPaymentMethodException, PaymentMethod } from '@/Domain/Ticketing/Payment/mod.ts';
import { PaymentMethodType } from '@/Domain/Ticketing/Payment/ValueObjects/PaymentMethod.ts';

Deno.test('[Unit] - PaymentMethod - fromString - credit card - returns CreditCard method', () => {
    // Act
    const method = PaymentMethod.fromString('Credit Card');

    // Assert
    assertEquals(method.paymentMethodType, PaymentMethodType.CreditCard);
});

Deno.test('[Unit] - PaymentMethod - fromString - bank transfer - returns BankTransfer method', () => {
    // Act
    const method = PaymentMethod.fromString('Bank Transfer');

    // Assert
    assertEquals(method.paymentMethodType, PaymentMethodType.BankTransfer);
});

Deno.test('[Unit] - PaymentMethod - fromString - case insensitive credit card - returns CreditCard method', () => {
    // Act
    const method = PaymentMethod.fromString('credit card');

    // Assert
    assertEquals(method.paymentMethodType, PaymentMethodType.CreditCard);
});

Deno.test('[Unit] - PaymentMethod - fromString - trimmed input - returns correct method', () => {
    // Act
    const method = PaymentMethod.fromString('  Credit Card  ');

    // Assert
    assertEquals(method.paymentMethodType, PaymentMethodType.CreditCard);
});

Deno.test('[Unit] - PaymentMethod - fromString - invalid method - throws InvalidPaymentMethodException', () => {
    // Act & Assert
    assertThrows(
        () => PaymentMethod.fromString('Crypto'),
        InvalidPaymentMethodException,
    );
});

Deno.test('[Unit] - PaymentMethod - fromString - empty string - throws InvalidPaymentMethodException', () => {
    // Act & Assert
    assertThrows(
        () => PaymentMethod.fromString(''),
        InvalidPaymentMethodException,
    );
});

Deno.test('[Unit] - PaymentMethod - static CreditCard - returns CreditCard singleton', () => {
    // Assert
    assertEquals(PaymentMethod.CreditCard.paymentMethodType, PaymentMethodType.CreditCard);
});

Deno.test('[Unit] - PaymentMethod - static BankTransfer - returns BankTransfer singleton', () => {
    // Assert
    assertEquals(PaymentMethod.BankTransfer.paymentMethodType, PaymentMethodType.BankTransfer);
});

Deno.test('[Unit] - PaymentMethod - equals - same method type - returns true', () => {
    // Arrange
    const left = PaymentMethod.fromString('Credit Card');
    const right = PaymentMethod.fromString('Credit Card');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - PaymentMethod - equals - different method types - returns false', () => {
    // Arrange
    const left = PaymentMethod.CreditCard;
    const right = PaymentMethod.BankTransfer;

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
