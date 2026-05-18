import { assertEquals, assertRejects } from '@std/assert';
import type { AggregateRoot, EntityId, Repository } from '@/Domain/Shared/mod.ts';
import type { Logger } from '@/Application/Ports/mod.ts';
import { PayOrderUseCase } from '@/Application/Ticketing/Payment/mod.ts';
import { OrderNotFoundException } from '@/Application/Ticketing/Orders/Exceptions/OrderNotFoundException.ts';
import {
    Order,
    Seat,
    Ticket,
    VisitorTypeLabel,
} from '@/Domain/Ticketing/Order/mod.ts';
import { MovieInfo } from '@/Domain/Ticketing/Order/ValueObjects/MovieInfo.ts';
import {
    InvalidPaymentMethodException,
} from '@/Domain/Ticketing/Payment/mod.ts';
import {
    MovieAgeRating,
    MovieDuration,
    MovieGenre,
    MovieId,
    MoviePosterUrl,
    MovieTitle,
} from '@/Domain/Ticketing/Shared/mod.ts';
import { MovieAgeRatingValue } from '@/Domain/Ticketing/Shared/ValueObjects/MovieAgeRating.ts';
import {
    createMockOnlinePaymentService,
    createMockOrderRepository,
    createMockUnitOfWork,
} from '@/tests/Unit/Application/Shared/mod.ts';

const mockLogger: Logger = {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
};

const makeTicket = () =>
    Ticket.create(
        MovieInfo.create(
            MovieId.create(),
            MovieTitle.create('Inception'),
            MovieDuration.create(120),
            [MovieGenre.create('Action')],
            MovieAgeRating.create(MovieAgeRatingValue.Twelve),
            MoviePosterUrl.create('https://example.com/inception.jpg'),
        ),
        Seat.create(1, VisitorTypeLabel.Standard),
        'Room A',
        new Date('2026-12-01T20:00:00Z'),
    );

const makeOpenOrder = () => Order.create('ext-booking-001', [makeTicket()]);

const validInput = {
    externalId: '550e8400-e29b-41d4-a716-446655440001',
    orderId: '',
    paymentMethod: 'Credit Card',
    cardNumber: '4111111111111111',
    expirationDate: new Date('2028-06-15T00:00:00Z'),
    cvv: '123',
    bookingId: '550e8400-e29b-41d4-a716-446655440002',
    amount: 18.00,
};

Deno.test(
    '[Unit] - PayOrderUseCase - execute - successful payment - returns payment id',
    async () => {
        // Arrange
        const order = makeOpenOrder();
        const mockOrderRepo = createMockOrderRepository({ existingOrders: [order] });
        const mockPaymentService = createMockOnlinePaymentService({
            defaultResponse: { success: true },
        });
        const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>([
            ['Order', mockOrderRepo as unknown as Repository<AggregateRoot<EntityId>, EntityId>],
        ]);
        const unitOfWork = createMockUnitOfWork({ repositories });
        const useCase = new PayOrderUseCase(unitOfWork, mockPaymentService, mockLogger);

        // Act
        const result = await useCase.execute({ ...validInput, orderId: order.id.value });

        // Assert
        assertEquals(typeof result.paymentId, 'string');
        assertEquals(result.paymentId.length > 0, true);
        assertEquals(unitOfWork.doCalled, true);
        assertEquals(unitOfWork.saveCalled, true);
        assertEquals(mockPaymentService.payCalled, true);
        assertEquals(mockPaymentService.payCallCount, 1);
    },
);

Deno.test(
    '[Unit] - PayOrderUseCase - execute - failed payment - saves payment in failed state',
    async () => {
        // Arrange
        const order = makeOpenOrder();
        const mockOrderRepo = createMockOrderRepository({ existingOrders: [order] });
        const mockPaymentService = createMockOnlinePaymentService({
            defaultResponse: { success: false, failureReason: 'Insufficient funds' },
        });
        const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>([
            ['Order', mockOrderRepo as unknown as Repository<AggregateRoot<EntityId>, EntityId>],
        ]);
        const unitOfWork = createMockUnitOfWork({ repositories });
        const useCase = new PayOrderUseCase(unitOfWork, mockPaymentService, mockLogger);

        // Act
        const result = await useCase.execute({ ...validInput, orderId: order.id.value });

        // Assert
        assertEquals(typeof result.paymentId, 'string');
        assertEquals(mockPaymentService.payCalled, true);
        assertEquals(unitOfWork.saveCalled, true);
    },
);

Deno.test(
    '[Unit] - PayOrderUseCase - execute - order not found - throws OrderNotFoundException',
    async () => {
        // Arrange
        const mockOrderRepo = createMockOrderRepository();
        const mockPaymentService = createMockOnlinePaymentService();
        const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>([
            ['Order', mockOrderRepo as unknown as Repository<AggregateRoot<EntityId>, EntityId>],
        ]);
        const unitOfWork = createMockUnitOfWork({ repositories });
        const useCase = new PayOrderUseCase(unitOfWork, mockPaymentService, mockLogger);

        // Act & Assert
        await assertRejects(
            () => useCase.execute({ ...validInput, orderId: '550e8400-e29b-41d4-a716-446655440000' }),
            OrderNotFoundException,
        );

        assertEquals(mockPaymentService.payCalled, false);
        assertEquals(unitOfWork.saveCalled, false);
    },
);

Deno.test(
    '[Unit] - PayOrderUseCase - execute - invalid payment method - propagates InvalidPaymentMethodException',
    async () => {
        // Arrange
        const order = makeOpenOrder();
        const mockOrderRepo = createMockOrderRepository({ existingOrders: [order] });
        const mockPaymentService = createMockOnlinePaymentService();
        const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>([
            ['Order', mockOrderRepo as unknown as Repository<AggregateRoot<EntityId>, EntityId>],
        ]);
        const unitOfWork = createMockUnitOfWork({ repositories });
        const useCase = new PayOrderUseCase(unitOfWork, mockPaymentService, mockLogger);

        // Act & Assert
        await assertRejects(
            () =>
                useCase.execute({
                    ...validInput,
                    orderId: order.id.value,
                    paymentMethod: 'Crypto',
                }),
            InvalidPaymentMethodException,
        );

        assertEquals(mockPaymentService.payCalled, false);
    },
);

Deno.test(
    '[Unit] - PayOrderUseCase - execute - payment service forwards correct request',
    async () => {
        // Arrange
        const order = makeOpenOrder();
        const mockOrderRepo = createMockOrderRepository({ existingOrders: [order] });
        const mockPaymentService = createMockOnlinePaymentService({
            defaultResponse: { success: true },
        });
        const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>([
            ['Order', mockOrderRepo as unknown as Repository<AggregateRoot<EntityId>, EntityId>],
        ]);
        const unitOfWork = createMockUnitOfWork({ repositories });
        const useCase = new PayOrderUseCase(unitOfWork, mockPaymentService, mockLogger);

        // Act
        await useCase.execute({ ...validInput, orderId: order.id.value });

        // Assert
        const receivedRequest = mockPaymentService.receivedRequests[0]!;
        assertEquals(receivedRequest.cardNumber, '4111111111111111');
        assertEquals(receivedRequest.cvv, '123');
        assertEquals(receivedRequest.amount, 18.00);
    },
);
