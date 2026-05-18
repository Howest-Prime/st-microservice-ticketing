import { Optional, UUID } from '@domaincrafters/std';
import { assertEquals, assertRejects } from '@std/assert';
import type { Logger } from '@/Application/Ports/mod.ts';
import type {
    GetOrderByBookingIdData,
    GetOrderByBookingIdQuery,
} from '@/Application/Ports/Queries/mod.ts';
import { GetOrderByBookingIdUseCase } from '@/Application/Ticketing/Orders/mod.ts';
import { OrderNotFoundException } from '@/Application/Ticketing/Orders/Exceptions/OrderNotFoundException.ts';

const mockLogger: Logger = {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
};

const bookingIdString = '550e8400-e29b-41d4-a716-446655440001';

const orderData: GetOrderByBookingIdData = {
    id: UUID.parse('d16efc5f-5f83-4b50-8cbf-fcce6f2a5833'),
    bookingId: UUID.parse(bookingIdString),
    status: 'Open',
    price: 18.00,
    customer: null,
    tickets: [],
};

Deno.test(
    '[Unit] - GetOrderByBookingIdUseCase - execute - existing booking id - returns order data',
    async () => {
        // Arrange
        let queriedBookingId = '';
        const queryPort: GetOrderByBookingIdQuery = {
            fetch: async (bookingId: string) => {
                queriedBookingId = bookingId;
                return Optional.of<GetOrderByBookingIdData>(orderData);
            },
        };

        const useCase = new GetOrderByBookingIdUseCase(queryPort, mockLogger);
        const input = { bookingId: bookingIdString };

        // Act
        const result = await useCase.execute(input);

        // Assert
        assertEquals(queriedBookingId, bookingIdString);
        assertEquals(result, orderData);
    },
);

Deno.test(
    '[Unit] - GetOrderByBookingIdUseCase - execute - booking id not found - throws OrderNotFoundException',
    async () => {
        // Arrange
        const queryPort: GetOrderByBookingIdQuery = {
            fetch: async () => Optional.empty<GetOrderByBookingIdData>(),
        };

        const useCase = new GetOrderByBookingIdUseCase(queryPort, mockLogger);
        const input = { bookingId: 'non-existent-booking-id' };

        // Act & Assert
        await assertRejects(
            () => useCase.execute(input),
            OrderNotFoundException,
        );
    },
);

Deno.test(
    '[Unit] - GetOrderByBookingIdUseCase - execute - query failure - propagates error',
    async () => {
        // Arrange
        const queryPort: GetOrderByBookingIdQuery = {
            fetch: async () => {
                throw new Error('Database connection failed');
            },
        };

        const useCase = new GetOrderByBookingIdUseCase(queryPort, mockLogger);

        // Act & Assert
        await assertRejects(
            () => useCase.execute({ bookingId: 'some-booking-id' }),
            Error,
            'Database connection failed',
        );
    },
);
