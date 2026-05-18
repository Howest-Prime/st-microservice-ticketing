import { assertEquals, assertRejects } from '@std/assert';
import type { AggregateRoot, EntityId, Repository } from '@/Domain/Shared/mod.ts';
import type { Logger } from '@/Application/Ports/mod.ts';
import { MarkOrderAsPaidUseCase } from '@/Application/Ticketing/Orders/mod.ts';
import { OrderNotFoundException } from '@/Application/Ticketing/Orders/Exceptions/OrderNotFoundException.ts';
import {
    CannotPayOrderException,
    Order,
    Seat,
    Ticket,
    VisitorTypeLabel,
} from '@/Domain/Ticketing/Order/mod.ts';
import { MovieInfo } from '@/Domain/Ticketing/Order/ValueObjects/MovieInfo.ts';
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

const makeOpenOrderWithTerms = () => {
    const order = Order.create('ext-booking-001', [makeTicket()]);
    order.acceptTerms();
    return order;
};

Deno.test(
    '[Unit] - MarkOrderAsPaidUseCase - execute - open order with terms - marks order as paid',
    async () => {
        // Arrange
        const order = makeOpenOrderWithTerms();
        const mockOrderRepo = createMockOrderRepository({ existingOrders: [order] });
        const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>([
            ['Order', mockOrderRepo as unknown as Repository<AggregateRoot<EntityId>, EntityId>],
        ]);
        const unitOfWork = createMockUnitOfWork({ repositories });
        const useCase = new MarkOrderAsPaidUseCase(unitOfWork, mockLogger);

        // Act
        await useCase.execute({ orderId: order.id.value });

        // Assert
        assertEquals(unitOfWork.doCalled, true);
        assertEquals(unitOfWork.saveCalled, true);
        assertEquals(unitOfWork.saveCallCount, 1);
        assertEquals(mockOrderRepo.byIdCalled, true);
    },
);

Deno.test(
    '[Unit] - MarkOrderAsPaidUseCase - execute - order not found - throws OrderNotFoundException',
    async () => {
        // Arrange
        const mockOrderRepo = createMockOrderRepository();
        const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>([
            ['Order', mockOrderRepo as unknown as Repository<AggregateRoot<EntityId>, EntityId>],
        ]);
        const unitOfWork = createMockUnitOfWork({ repositories });
        const useCase = new MarkOrderAsPaidUseCase(unitOfWork, mockLogger);

        // Act & Assert
        await assertRejects(
            () => useCase.execute({ orderId: '550e8400-e29b-41d4-a716-446655440000' }),
            OrderNotFoundException,
        );

        assertEquals(unitOfWork.saveCalled, false);
    },
);

Deno.test(
    '[Unit] - MarkOrderAsPaidUseCase - execute - cancelled order - propagates CannotPayOrderException',
    async () => {
        // Arrange
        const order = Order.create('ext-booking-001', [makeTicket()]);
        order.cancel();
        const mockOrderRepo = createMockOrderRepository({ existingOrders: [order] });
        const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>([
            ['Order', mockOrderRepo as unknown as Repository<AggregateRoot<EntityId>, EntityId>],
        ]);
        const unitOfWork = createMockUnitOfWork({ repositories });
        const useCase = new MarkOrderAsPaidUseCase(unitOfWork, mockLogger);

        // Act & Assert
        await assertRejects(
            () => useCase.execute({ orderId: order.id.value }),
            CannotPayOrderException,
        );

        assertEquals(unitOfWork.saveCalled, false);
    },
);
