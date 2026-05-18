import { assertEquals, assertRejects } from '@std/assert';
import type { Logger } from '@/Application/Ports/mod.ts';
import type { MarkOrderAsPaidInput } from '@/Application/Ticketing/Orders/mod.ts';
import { WhenPaymentSucceededThenMarkOrderAsPaid } from '@/Application/Ticketing/Payment/mod.ts';
import { PaymentSucceeeded } from '@/Domain/Ticketing/Payment/mod.ts';

const mockLogger: Logger = {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
};

Deno.test(
    '[Unit] - WhenPaymentSucceededThenMarkOrderAsPaid - handle - valid PaymentSucceeded event - delegates to MarkOrderAsPaidUseCase',
    async () => {
        // Arrange
        const receivedInputs: MarkOrderAsPaidInput[] = [];
        const mockMarkOrderAsPaidUseCase = {
            execute: async (input: MarkOrderAsPaidInput): Promise<void> => {
                receivedInputs.push(input);
            },
        };

        const policy = new WhenPaymentSucceededThenMarkOrderAsPaid(
            mockMarkOrderAsPaidUseCase,
            mockLogger,
        );
        const event = PaymentSucceeeded.create('payment-id-001', 'order-id-001', 'booking-id-001');

        // Act
        await policy.handle(event);

        // Assert
        assertEquals(receivedInputs.length, 1);
        assertEquals(receivedInputs[0]!.orderId, 'order-id-001');
    },
);

Deno.test(
    '[Unit] - WhenPaymentSucceededThenMarkOrderAsPaid - handle - use case throws - propagates error',
    async () => {
        // Arrange
        const expectedError = new Error('Mark order as paid failed');
        const mockMarkOrderAsPaidUseCase = {
            execute: async (_input: MarkOrderAsPaidInput): Promise<void> => {
                throw expectedError;
            },
        };

        const policy = new WhenPaymentSucceededThenMarkOrderAsPaid(
            mockMarkOrderAsPaidUseCase,
            mockLogger,
        );
        const event = PaymentSucceeeded.create('payment-id-002', 'order-id-002', 'booking-id-002');

        // Act & Assert
        await assertRejects(
            () => policy.handle(event),
            Error,
            'Mark order as paid failed',
        );
    },
);

Deno.test(
    '[Unit] - WhenPaymentSucceededThenMarkOrderAsPaid - handle - event with specific orderId - passes correct id to use case',
    async () => {
        // Arrange
        let capturedOrderId = '';
        const mockMarkOrderAsPaidUseCase = {
            execute: async (input: MarkOrderAsPaidInput): Promise<void> => {
                capturedOrderId = input.orderId;
            },
        };

        const policy = new WhenPaymentSucceededThenMarkOrderAsPaid(
            mockMarkOrderAsPaidUseCase,
            mockLogger,
        );
        const event = PaymentSucceeeded.create('payment-abc', 'order-specific-789', 'booking-abc');

        // Act
        await policy.handle(event);

        // Assert
        assertEquals(capturedOrderId, 'order-specific-789');
    },
);
