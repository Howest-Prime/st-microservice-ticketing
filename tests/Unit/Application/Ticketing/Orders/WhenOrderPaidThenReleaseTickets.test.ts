import { assertEquals, assertRejects } from '@std/assert';
import type { Logger } from '@/Application/Ports/mod.ts';
import type { ReleaseTicketInput } from '@/Application/Ticketing/Orders/mod.ts';
import { WhenOrderPaidThenReleaseTickets } from '@/Application/Ticketing/Orders/mod.ts';
import { OrderPaid } from '@/Domain/Ticketing/Order/mod.ts';

const mockLogger: Logger = {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
};

Deno.test(
    '[Unit] - WhenOrderPaidThenReleaseTickets - handle - valid OrderPaid event - delegates to ReleaseTicketUseCase',
    async () => {
        // Arrange
        const receivedInputs: ReleaseTicketInput[] = [];
        const mockReleaseTicketUseCase = {
            execute: async (input: ReleaseTicketInput): Promise<void> => {
                receivedInputs.push(input);
            },
        };

        const policy = new WhenOrderPaidThenReleaseTickets(mockReleaseTicketUseCase, mockLogger);
        const event = OrderPaid.create('order-id-001', 'booking-id-001');

        // Act
        await policy.handle(event);

        // Assert
        assertEquals(receivedInputs.length, 1);
        assertEquals(receivedInputs[0]!.orderId, 'order-id-001');
    },
);

Deno.test(
    '[Unit] - WhenOrderPaidThenReleaseTickets - handle - use case throws - propagates error',
    async () => {
        // Arrange
        const expectedError = new Error('Release ticket failed');
        const mockReleaseTicketUseCase = {
            execute: async (_input: ReleaseTicketInput): Promise<void> => {
                throw expectedError;
            },
        };

        const policy = new WhenOrderPaidThenReleaseTickets(mockReleaseTicketUseCase, mockLogger);
        const event = OrderPaid.create('order-id-002', 'booking-id-002');

        // Act & Assert
        await assertRejects(
            () => policy.handle(event),
            Error,
            'Release ticket failed',
        );
    },
);

Deno.test(
    '[Unit] - WhenOrderPaidThenReleaseTickets - handle - event with specific orderId - passes correct id to use case',
    async () => {
        // Arrange
        let capturedOrderId = '';
        const mockReleaseTicketUseCase = {
            execute: async (input: ReleaseTicketInput): Promise<void> => {
                capturedOrderId = input.orderId;
            },
        };

        const policy = new WhenOrderPaidThenReleaseTickets(mockReleaseTicketUseCase, mockLogger);
        const event = OrderPaid.create('specific-order-123', 'booking-456');

        // Act
        await policy.handle(event);

        // Assert
        assertEquals(capturedOrderId, 'specific-order-123');
    },
);
