import { AmqpController } from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import type { SaveMovieUseCaseInput } from '@/Application/Ticketing/Movies/mod.ts';
import type { UseCase } from '@/Application/Ports/mod.ts';
import { UUID } from '@domaincrafters/std';

export interface SaveMovieRequest {
    movieId: UUID;
    title: string;
    duration: number;
    genres: string[];
    ageRating: number;
    posterUrl: string;
}

export class SaveMovieController implements AmqpController<SaveMovieRequest> {
    constructor(
        private readonly _useCase: UseCase<SaveMovieUseCaseInput, string>,
    ) {}

    async handle(request: SaveMovieRequest): Promise<void> {
        const input: SaveMovieUseCaseInput = {
            movieExternalId: request.movieId.toString(),
            movieTitle: request.title,
            movieDuration: Number(request.duration),
            movieGenres: request.genres,
            posterUrl: request.posterUrl,
            ageRating: Number(request.ageRating),
        };
        await this._useCase.execute(input);
    }
}