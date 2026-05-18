import { assertEquals, assertRejects } from '@std/assert';
import type { Logger } from '@/Application/Ports/mod.ts';
import type { CancelOrderInput } from '@/Application/Ticketing/Orders/mod.ts';
import { WhenPaymentFailedThenCancelOrder } from '@/Application/Ticketing/Orders/mod.ts';
import { PaymentFailed } from '@/Domain/Ticketing/Payment/mod.ts';

const mockLogger: Logger = {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
};

Deno.test(
    '[Unit] - WhenPaymentFailedThenCancelOrder - handle - valid PaymentFailed event - delegates to CancelOrderUseCase',
    async () => {
        // Arrange
        const receivedInputs: CancelOrderInput[] = [];
        const mockCancelOrderUseCase = {
            execute: async (input: CancelOrderInput): Promise<void> => {
                receivedInputs.push(input);
            },
        };

        const policy = new WhenPaymentFailedThenCancelOrder(mockCancelOrderUseCase, mockLogger);
        const event = PaymentFailed.create('payment-id-001', 'order-id-001', 'booking-id-001', 'Card declined');

        // Act
        await policy.handle(event);

        // Assert
        assertEquals(receivedInputs.length, 1);
        assertEquals(receivedInputs[0]!.orderId, 'order-id-001');
    },
);

Deno.test(
    '[Unit] - WhenPaymentFailedThenCancelOrder - handle - use case throws - propagates error',
    async () => {
        // Arrange
        const expectedError = new Error('Cancel order failed');
        const mockCancelOrderUseCase = {
            execute: async (_input: CancelOrderInput): Promise<void> => {
                throw expectedError;
            },
        };

        const policy = new WhenPaymentFailedThenCancelOrder(mockCancelOrderUseCase, mockLogger);
        const event = PaymentFailed.create('payment-id-002', 'order-id-002', 'booking-id-002', 'Insufficient funds');

        // Act & Assert
        await assertRejects(
            () => policy.handle(event),
            Error,
            'Cancel order failed',
        );
    },
);

Deno.test(
    '[Unit] - WhenPaymentFailedThenCancelOrder - handle - event with specific orderId - passes correct id to use case',
    async () => {
        // Arrange
        let capturedOrderId = '';
        const mockCancelOrderUseCase = {
            execute: async (input: CancelOrderInput): Promise<void> => {
                capturedOrderId = input.orderId;
            },
        };

        const policy = new WhenPaymentFailedThenCancelOrder(mockCancelOrderUseCase, mockLogger);
        const event = PaymentFailed.create('payment-xyz', 'order-xyz', 'booking-xyz', 'Timeout');

        // Act
        await policy.handle(event);

        // Assert
        assertEquals(capturedOrderId, 'order-xyz');
    },
);
