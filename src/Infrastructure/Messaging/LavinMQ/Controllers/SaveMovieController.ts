import { AmqpController } from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import type { SaveMovieUseCaseInput } from '@/Application/Ticketing/Movies/mod.ts';
import type { UseCase } from '@/Application/Ports/mod.ts';
import { IllegalArgumentException } from '@domaincrafters/std';

export interface SaveMovieRequest {
    movieId: unknown;
    title: unknown;
    duration: unknown;
    genres: unknown;
    ageRating: unknown;
    posterUrl: unknown;
}

export class SaveMovieController implements AmqpController<SaveMovieRequest> {
    constructor(
        private readonly _useCase: UseCase<SaveMovieUseCaseInput, string>,
    ) {}

    async handle(request: SaveMovieRequest): Promise<void> {
        const input = this.extractInput(request);
        await this._useCase.execute(input);
    }

    private extractInput(request: unknown): SaveMovieUseCaseInput {
        if (request === null || typeof request !== 'object') {
            throw new IllegalArgumentException(
                'Movie create payload must be a JSON object.',
            );
        }

        const payload = request as Record<string, unknown>;

        if (Object.hasOwn(payload, 'payload')) {
            throw new IllegalArgumentException(
                "Unexpected wrapper field 'payload'. Expected direct fields.",
            );
        }

        return {
            movieExternalId: this.requireNonEmptyString(
                payload.movieId,
                'movieId',
            ),
            movieTitle: this.requireNonEmptyString(
                payload.title,
                'title',
            ),
            movieDuration: this.requireNumber(
                payload.duration,
                'duration',
            ),
            movieGenres: this.requireStringArray(
                payload.genres,
                'genres',
            ),
            posterUrl: this.requireNonEmptyString(
                payload.posterUrl,
                'posterUrl',
            ),
            ageRating: this.requireNumber(
                payload.ageRating,
                'ageRating',
            ),
        };
    }

    private requireNonEmptyString(
        value: unknown,
        fieldName: string,
    ): string {
        if (typeof value !== 'string') {
            throw new IllegalArgumentException(
                `Field '${fieldName}' must be a string.`,
            );
        }

        if (value.trim().length === 0) {
            throw new IllegalArgumentException(
                `Field '${fieldName}' must not be empty.`,
            );
        }

        return value;
    }

    private requireNumber(value: unknown, fieldName: string): number {
        if (typeof value !== 'number' || Number.isNaN(value)) {
            throw new IllegalArgumentException(
                `Field '${fieldName}' must be a valid number.`,
            );
        }

        return value;
    }

    private requireStringArray(
        value: unknown,
        fieldName: string,
    ): string[] {
        if (!Array.isArray(value)) {
            throw new IllegalArgumentException(
                `Field '${fieldName}' must be an array.`,
            );
        }

        for (const item of value) {
            if (typeof item !== 'string') {
                throw new IllegalArgumentException(
                    `All items in '${fieldName}' must be strings.`,
                );
            }
        }

        return value;
    }
}