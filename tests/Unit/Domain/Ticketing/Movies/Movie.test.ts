import { assertEquals, assertThrows } from '@std/assert';
import {
    Movie,
    MovieAgeRating,
    MovieDuration,
    MovieGenre,
    MoviePosterUrl,
    MovieTitle,
    InvalidGenresException,
} from '@/Domain/Ticketing/Movies/mod.ts';
import { MovieAgeRatingValue } from '@/Domain/Ticketing/Movies/ValueObjects/MovieAgeRating.ts';
import { MovieId } from '@/Domain/Ticketing/Movies/Movie.ts';
import { Money } from '@/Domain/Ticketing/Shared/mod.ts';

const makeMovie = () =>
    Movie.create(
        'ext-001',
        MovieTitle.create('Inception'),
        MovieDuration.create(148),
        [MovieGenre.create('Action'), MovieGenre.create('Sci-Fi')],
        MovieAgeRating.create(MovieAgeRatingValue.Twelve),
        MoviePosterUrl.create('https://example.com/inception.jpg'),
    );

Deno.test('[Unit] - Movie - create - valid input - returns aggregate with correct properties', () => {
    // Act
    const movie = makeMovie();

    // Assert
    assertEquals(movie.externalId, 'ext-001');
    assertEquals(movie.title.value, 'Inception');
    assertEquals(movie.duration.value, 148);
    assertEquals(movie.genres.length, 2);
    assertEquals(movie.ageRating.Value, 12);
    assertEquals(movie.posterUrl.value, 'https://example.com/inception.jpg');
});

Deno.test('[Unit] - Movie - create - valid input - assigns a unique MovieId', () => {
    // Act
    const movie = makeMovie();

    // Assert
    assertEquals(movie.movieId instanceof MovieId, true);
});

Deno.test('[Unit] - Movie - create - valid input - calculates price as duration times 0.15 EUR', () => {
    // Arrange
    const movie = Movie.create(
        'ext-002',
        MovieTitle.create('Interstellar'),
        MovieDuration.create(120),
        [MovieGenre.create('Sci-Fi')],
        MovieAgeRating.create(MovieAgeRatingValue.All),
        MoviePosterUrl.create('https://example.com/interstellar.jpg'),
    );

    // Assert
    assertEquals(movie.price.amount, 18); // 120 * 0.15
    assertEquals(movie.price.currency, 'EUR');
});

Deno.test('[Unit] - Movie - create - two movies with same data - have different ids', () => {
    // Act
    const first = makeMovie();
    const second = makeMovie();

    // Assert
    assertEquals(first.movieId.equals(second.movieId), false);
});

Deno.test('[Unit] - Movie - set title - updates title on the aggregate', () => {
    // Arrange
    const movie = makeMovie();
    const newTitle = MovieTitle.create('Interstellar');

    // Act
    movie.title = newTitle;

    // Assert
    assertEquals(movie.title.value, 'Interstellar');
});

Deno.test('[Unit] - Movie - set duration - updates duration on the aggregate', () => {
    // Arrange
    const movie = makeMovie();
    const newDuration = MovieDuration.create(90);

    // Act
    movie.duration = newDuration;

    // Assert
    assertEquals(movie.duration.value, 90);
});

Deno.test('[Unit] - Movie - set genres - updates genres list on the aggregate', () => {
    // Arrange
    const movie = makeMovie();
    const newGenres = [MovieGenre.create('Drama')];

    // Act
    movie.genres = newGenres;

    // Assert
    const [first] = movie.genres;
    assertEquals(movie.genres.length, 1);
    assertEquals(first?.value, 'Drama');
});

Deno.test('[Unit] - Movie - set ageRating - updates age rating on the aggregate', () => {
    // Arrange
    const movie = makeMovie();
    const newAgeRating = MovieAgeRating.create(MovieAgeRatingValue.Eighteen);

    // Act
    movie.ageRating = newAgeRating;

    // Assert
    assertEquals(movie.ageRating.Value, 18);
});

Deno.test('[Unit] - Movie - set posterUrl - updates poster url on the aggregate', () => {
    // Arrange
    const movie = makeMovie();
    const newPosterUrl = MoviePosterUrl.create('https://example.com/new-poster.jpg');

    // Act
    movie.posterUrl = newPosterUrl;

    // Assert
    assertEquals(movie.posterUrl.value, 'https://example.com/new-poster.jpg');
});

Deno.test('[Unit] - Movie - set price - updates price on the aggregate', () => {
    // Arrange
    const movie = makeMovie();
    const newPrice = Money.create(25.00, 'USD');

    // Act
    movie.price = newPrice;

    // Assert
    assertEquals(movie.price.amount, 25.00);
    assertEquals(movie.price.currency, 'USD');
});

Deno.test('[Unit] - Movie - create - empty genres list - throws InvalidGenresException', () => {
    // Act & Assert
    assertThrows(
        () =>
            Movie.create(
                'ext-003',
                MovieTitle.create('Inception'),
                MovieDuration.create(148),
                [],
                MovieAgeRating.create(MovieAgeRatingValue.Twelve),
                MoviePosterUrl.create('https://example.com/inception.jpg'),
            ),
        InvalidGenresException,
    );
});
