import { assertEquals, assertRejects } from '@std/assert';
import type { Logger } from '@/Application/Ports/mod.ts';
import { SaveMovieUseCase } from '@/Application/Ticketing/Movies/mod.ts';
import {
    InvalidMovieDuration,
    InvalidMovieTitle,
    InvalidPosterUrl,
} from '@/Domain/Ticketing/Shared/mod.ts';
import { createMockUnitOfWork } from '@/tests/Unit/Application/Shared/mod.ts';

const mockLogger: Logger = {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
};

const validInput = {
    movieExternalId: 'ext-001',
    movieTitle: 'Inception',
    movieDuration: 148,
    movieGenres: ['Action', 'Sci-Fi'],
    posterUrl: 'https://example.com/inception.jpg',
    ageRating: 12,
};

Deno.test(
    '[Unit] - SaveMovieUseCase - execute - valid input - saves movie and returns id',
    async () => {
        // Arrange
        const unitOfWork = createMockUnitOfWork();
        const useCase = new SaveMovieUseCase(unitOfWork, mockLogger);

        // Act
        const result = await useCase.execute(validInput);

        // Assert
        assertEquals(typeof result, 'string');
        assertEquals(result.length > 0, true);
        assertEquals(unitOfWork.doCalled, true);
        assertEquals(unitOfWork.saveCalled, true);
        assertEquals(unitOfWork.saveCallCount, 1);
    },
);

Deno.test(
    '[Unit] - SaveMovieUseCase - execute - invalid title - propagates InvalidMovieTitle',
    async () => {
        // Arrange
        const unitOfWork = createMockUnitOfWork();
        const useCase = new SaveMovieUseCase(unitOfWork, mockLogger);

        // Act & Assert
        await assertRejects(
            () => useCase.execute({ ...validInput, movieTitle: 'ab' }),
            InvalidMovieTitle,
        );
        assertEquals(unitOfWork.saveCalled, false);
    },
);

Deno.test(
    '[Unit] - SaveMovieUseCase - execute - invalid duration - propagates InvalidMovieDuration',
    async () => {
        // Arrange
        const unitOfWork = createMockUnitOfWork();
        const useCase = new SaveMovieUseCase(unitOfWork, mockLogger);

        // Act & Assert
        await assertRejects(
            () => useCase.execute({ ...validInput, movieDuration: 0 }),
            InvalidMovieDuration,
        );
        assertEquals(unitOfWork.saveCalled, false);
    },
);

Deno.test(
    '[Unit] - SaveMovieUseCase - execute - invalid poster url - propagates InvalidPosterUrl',
    async () => {
        // Arrange
        const unitOfWork = createMockUnitOfWork();
        const useCase = new SaveMovieUseCase(unitOfWork, mockLogger);

        // Act & Assert
        await assertRejects(
            () => useCase.execute({ ...validInput, posterUrl: 'not-a-url' }),
            InvalidPosterUrl,
        );
        assertEquals(unitOfWork.saveCalled, false);
    },
);
