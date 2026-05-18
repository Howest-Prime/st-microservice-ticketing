import { Optional } from '@domaincrafters/std';

import type { Movie } from '@/Domain/Ticketing/Movies/mod.ts';
import type { MovieId } from '@/Domain/Ticketing/Shared/mod.ts';
import type { MovieRepository } from '@/Domain/Ticketing/Movies/MovieRepository.ts';

interface MockMovieRepositoryOptions {
    byId?: (id: MovieId) => Promise<Optional<Movie>>;
    byExternalId?: (externalId: string) => Promise<Optional<Movie>>;
    save?: (movie: Movie) => Promise<void>;
    remove?: (movie: Movie) => Promise<void>;
    existingMovies?: Movie[];
}

export function createMockMovieRepository(
    options: MockMovieRepositoryOptions = {},
): MovieRepository & {
    byIdCalled: boolean;
    byIdCallCount: number;
    byExternalIdCalled: boolean;
    byExternalIdCallCount: number;
    saveCalled: boolean;
    saveCallCount: number;
    removeCalled: boolean;
    removeCallCount: number;
    savedMovies: Movie[];
    removedMovies: Movie[];
    storedMovies: Map<string, Movie>;
} {
    const storedMovies = new Map<string, Movie>(
        (options.existingMovies ?? []).map((movie) => [movie.movieId.value, movie]),
    );
    const savedMovies: Movie[] = [];
    const removedMovies: Movie[] = [];

    const mock = {
        byIdCalled: false,
        byIdCallCount: 0,
        byExternalIdCalled: false,
        byExternalIdCallCount: 0,
        saveCalled: false,
        saveCallCount: 0,
        removeCalled: false,
        removeCallCount: 0,
        savedMovies,
        removedMovies,
        storedMovies,

        byId: async (id: MovieId): Promise<Optional<Movie>> => {
            mock.byIdCalled = true;
            mock.byIdCallCount++;

            if (options.byId) {
                return await options.byId(id);
            }

            const movie = storedMovies.get(id.value);
            if (!movie) {
                return Optional.empty<Movie>();
            }

            return Optional.of<Movie>(movie);
        },

        byExternalId: async (externalId: string): Promise<Optional<Movie>> => {
            mock.byExternalIdCalled = true;
            mock.byExternalIdCallCount++;

            if (options.byExternalId) {
                return await options.byExternalId(externalId);
            }

            for (const movie of storedMovies.values()) {
                if (movie.externalId === externalId) {
                    return Optional.of<Movie>(movie);
                }
            }

            return Optional.empty<Movie>();
        },

        save: async (movie: Movie): Promise<void> => {
            mock.saveCalled = true;
            mock.saveCallCount++;
            savedMovies.push(movie);

            if (options.save) {
                await options.save(movie);
                return;
            }

            storedMovies.set(movie.movieId.value, movie);
        },

        remove: async (movie: Movie): Promise<void> => {
            mock.removeCalled = true;
            mock.removeCallCount++;
            removedMovies.push(movie);

            if (options.remove) {
                await options.remove(movie);
                return;
            }

            storedMovies.delete(movie.movieId.value);
        },
    };

    return mock as MovieRepository & {
        byIdCalled: boolean;
        byIdCallCount: number;
        byExternalIdCalled: boolean;
        byExternalIdCallCount: number;
        saveCalled: boolean;
        saveCallCount: number;
        removeCalled: boolean;
        removeCallCount: number;
        savedMovies: Movie[];
        removedMovies: Movie[];
        storedMovies: Map<string, Movie>;
    };
}
