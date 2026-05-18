import { assertEquals, assertRejects } from '@std/assert';
import type { AggregateRoot, EntityId, Repository } from '@/Domain/Shared/mod.ts';
import type { Logger } from '@/Application/Ports/mod.ts';
import { CreateOrderFromBookingUseCase } from '@/Application/Ticketing/Orders/mod.ts';
import { MovieNotFoundException } from '@/Application/Ticketing/Orders/Exceptions/MovieNotFoundException.ts';
import { Movie } from '@/Domain/Ticketing/Movies/mod.ts';
import {
    MovieAgeRating,
    MovieDuration,
    MovieGenre,
    MoviePosterUrl,
    MovieTitle,
} from '@/Domain/Ticketing/Shared/mod.ts';
import { MovieAgeRatingValue } from '@/Domain/Ticketing/Shared/ValueObjects/MovieAgeRating.ts';
import {
    createMockMovieRepository,
    createMockUnitOfWork,
} from '@/tests/Unit/Application/Shared/mod.ts';

const mockLogger: Logger = {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
};

const makeMovie = () =>
    Movie.create(
        'ext-movie-001',
        MovieTitle.create('Inception'),
        MovieDuration.create(120),
        [MovieGenre.create('Action')],
        MovieAgeRating.create(MovieAgeRatingValue.Twelve),
        MoviePosterUrl.create('https://example.com/inception.jpg'),
    );

const validInput = {
    bookingId: 'booking-ext-001',
    movieId: 'ext-movie-001',
    room: 'Room A',
    showtime: new Date('2026-12-01T20:00:00Z'),
    amountOfStandardVisitors: 2,
    amountOfDiscountedVisitors: 1,
    seats: [1, 2, 3],
};

Deno.test(
    '[Unit] - CreateOrderFromBookingUseCase - execute - valid input - creates order and returns id',
    async () => {
        // Arrange
        const movie = makeMovie();
        const mockMovieRepo = createMockMovieRepository({ existingMovies: [movie] });
        const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>([
            ['Movie', mockMovieRepo as unknown as Repository<AggregateRoot<EntityId>, EntityId>],
        ]);
        const unitOfWork = createMockUnitOfWork({ repositories });
        const useCase = new CreateOrderFromBookingUseCase(unitOfWork, mockLogger);

        // Act
        const result = await useCase.execute(validInput);

        // Assert
        assertEquals(typeof result, 'string');
        assertEquals(result.length > 0, true);
        assertEquals(unitOfWork.doCalled, true);
        assertEquals(unitOfWork.saveCalled, true);
        assertEquals(unitOfWork.saveCallCount, 1);
        assertEquals(mockMovieRepo.byExternalIdCalled, true);
        assertEquals(mockMovieRepo.byExternalIdCallCount, 1);
    },
);

Deno.test(
    '[Unit] - CreateOrderFromBookingUseCase - execute - movie not found - throws MovieNotFoundException',
    async () => {
        // Arrange
        const mockMovieRepo = createMockMovieRepository();
        const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>([
            ['Movie', mockMovieRepo as unknown as Repository<AggregateRoot<EntityId>, EntityId>],
        ]);
        const unitOfWork = createMockUnitOfWork({ repositories });
        const useCase = new CreateOrderFromBookingUseCase(unitOfWork, mockLogger);

        // Act & Assert
        await assertRejects(
            () => useCase.execute(validInput),
            MovieNotFoundException,
        );

        assertEquals(unitOfWork.saveCalled, false);
    },
);

Deno.test(
    '[Unit] - CreateOrderFromBookingUseCase - execute - valid input - creates correct number of tickets',
    async () => {
        // Arrange
        const movie = makeMovie();
        const mockMovieRepo = createMockMovieRepository({ existingMovies: [movie] });
        const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>([
            ['Movie', mockMovieRepo as unknown as Repository<AggregateRoot<EntityId>, EntityId>],
        ]);
        const unitOfWork = createMockUnitOfWork({ repositories });
        const useCase = new CreateOrderFromBookingUseCase(unitOfWork, mockLogger);

        // Act
        await useCase.execute(validInput);

        // Assert - 2 standard + 1 discounted = 3 tickets saved
        assertEquals(unitOfWork.savedEntities.length, 1);
    },
);

Deno.test(
    '[Unit] - CreateOrderFromBookingUseCase - execute - only standard visitors - creates order with standard tickets',
    async () => {
        // Arrange
        const movie = makeMovie();
        const mockMovieRepo = createMockMovieRepository({ existingMovies: [movie] });
        const repositories = new Map<string, Repository<AggregateRoot<EntityId>, EntityId>>([
            ['Movie', mockMovieRepo as unknown as Repository<AggregateRoot<EntityId>, EntityId>],
        ]);
        const unitOfWork = createMockUnitOfWork({ repositories });
        const useCase = new CreateOrderFromBookingUseCase(unitOfWork, mockLogger);

        // Act
        const result = await useCase.execute({
            ...validInput,
            amountOfStandardVisitors: 2,
            amountOfDiscountedVisitors: 0,
            seats: [1, 2],
        });

        // Assert
        assertEquals(typeof result, 'string');
        assertEquals(unitOfWork.saveCalled, true);
    },
);
