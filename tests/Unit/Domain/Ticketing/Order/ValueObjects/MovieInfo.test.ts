import { assertEquals, assertThrows } from '@std/assert';
import { MovieInfo } from '@/Domain/Ticketing/Order/ValueObjects/MovieInfo.ts';
import {
    InvalidGenresException,
    MovieAgeRating,
    MovieDuration,
    MovieGenre,
    MovieId,
    MoviePosterUrl,
    MovieTitle,
} from '@/Domain/Ticketing/Shared/mod.ts';
import { MovieAgeRatingValue } from '@/Domain/Ticketing/Shared/ValueObjects/MovieAgeRating.ts';

const makeMovieInfo = (overrides: {
    id?: MovieId;
    title?: string;
    duration?: number;
    genres?: MovieGenre[];
    ageRating?: MovieAgeRatingValue;
    posterUrl?: string;
} = {}) =>
    MovieInfo.create(
        overrides.id ?? MovieId.create(),
        MovieTitle.create(overrides.title ?? 'Inception'),
        MovieDuration.create(overrides.duration ?? 120),
        overrides.genres ?? [MovieGenre.create('Action')],
        MovieAgeRating.create(overrides.ageRating ?? MovieAgeRatingValue.Twelve),
        MoviePosterUrl.create(overrides.posterUrl ?? 'https://example.com/inception.jpg'),
    );

Deno.test('[Unit] - MovieInfo - create - valid input - returns MovieInfo with correct properties', () => {
    // Act
    const info = makeMovieInfo();

    // Assert
    assertEquals(info.title.value, 'Inception');
    assertEquals(info.duration.value, 120);
    assertEquals(info.genres.length, 1);
    assertEquals(info.genres[0]!.value, 'Action');
    assertEquals(info.ageRating.Value, 12);
    assertEquals(info.posterUrl.value, 'https://example.com/inception.jpg');
});

Deno.test('[Unit] - MovieInfo - create - valid input - calculates price from duration', () => {
    // Act
    const info = makeMovieInfo({ duration: 120 });

    // Assert
    assertEquals(info.price.amount, 18); // 120 * 0.15
    assertEquals(info.price.currency, 'EUR');
});

Deno.test('[Unit] - MovieInfo - create - different duration - calculates correct price', () => {
    // Act
    const info = makeMovieInfo({ duration: 90 });

    // Assert
    assertEquals(info.price.amount, 13.5); // 90 * 0.15
});

Deno.test('[Unit] - MovieInfo - create - empty genres - throws InvalidGenresException', () => {
    // Act & Assert
    assertThrows(
        () => makeMovieInfo({ genres: [] }),
        InvalidGenresException,
    );
});

Deno.test('[Unit] - MovieInfo - create - multiple genres - returns all genres', () => {
    // Arrange
    const genres = [MovieGenre.create('Action'), MovieGenre.create('Drama')];

    // Act
    const info = makeMovieInfo({ genres });

    // Assert
    assertEquals(info.genres.length, 2);
    assertEquals(info.genres[0]!.value, 'Action');
    assertEquals(info.genres[1]!.value, 'Drama');
});

Deno.test('[Unit] - MovieInfo - genres - returns defensive copy', () => {
    // Arrange
    const info = makeMovieInfo();
    const genres = info.genres;

    // Act - mutate the returned array
    genres.push(MovieGenre.create('Drama'));

    // Assert - original is unaffected
    assertEquals(info.genres.length, 1);
});

Deno.test('[Unit] - MovieInfo - equals - same id and all fields - returns true', () => {
    // Arrange
    const id = MovieId.create();
    const info1 = makeMovieInfo({ id });
    const info2 = makeMovieInfo({ id });

    // Act
    const result = info1.equals(info2);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - MovieInfo - equals - different id same fields - returns false', () => {
    // Arrange
    const info1 = makeMovieInfo();
    const info2 = makeMovieInfo();

    // Act
    const result = info1.equals(info2);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - MovieInfo - equals - same id different title - returns false', () => {
    // Arrange
    const id = MovieId.create();
    const info1 = makeMovieInfo({ id, title: 'Inception' });
    const info2 = makeMovieInfo({ id, title: 'Interstellar' });

    // Act
    const result = info1.equals(info2);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - MovieInfo - equals - same id different duration - returns false', () => {
    // Arrange
    const id = MovieId.create();
    const info1 = makeMovieInfo({ id, duration: 120 });
    const info2 = makeMovieInfo({ id, duration: 90 });

    // Act
    const result = info1.equals(info2);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - MovieInfo - equals - same id different genres - returns false', () => {
    // Arrange
    const id = MovieId.create();
    const info1 = makeMovieInfo({ id, genres: [MovieGenre.create('Action')] });
    const info2 = makeMovieInfo({ id, genres: [MovieGenre.create('Drama')] });

    // Act
    const result = info1.equals(info2);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - MovieInfo - equals - same id different genre count - returns false', () => {
    // Arrange
    const id = MovieId.create();
    const info1 = makeMovieInfo({ id, genres: [MovieGenre.create('Action')] });
    const info2 = makeMovieInfo({ id, genres: [MovieGenre.create('Action'), MovieGenre.create('Drama')] });

    // Act
    const result = info1.equals(info2);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - MovieInfo - equals - same id different age rating - returns false', () => {
    // Arrange
    const id = MovieId.create();
    const info1 = makeMovieInfo({ id, ageRating: MovieAgeRatingValue.Twelve });
    const info2 = makeMovieInfo({ id, ageRating: MovieAgeRatingValue.Eighteen });

    // Act
    const result = info1.equals(info2);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - MovieInfo - equals - same id different poster url - returns false', () => {
    // Arrange
    const id = MovieId.create();
    const info1 = makeMovieInfo({ id, posterUrl: 'https://example.com/a.jpg' });
    const info2 = makeMovieInfo({ id, posterUrl: 'https://example.com/b.jpg' });

    // Act
    const result = info1.equals(info2);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - MovieInfo - Id getter - returns the movie id', () => {
    // Arrange
    const id = MovieId.create();
    const info = makeMovieInfo({ id });

    // Assert
    assertEquals(info.Id.equals(id), true);
});
