import { assertEquals, assertThrows } from '@std/assert';
import { InvalidMovieGenre, MovieGenre } from '@/Domain/Ticketing/Shared/mod.ts';

Deno.test('[Unit] - MovieGenre - create - valid input - returns value object', () => {
    // Arrange
    const genre = 'Action';

    // Act
    const movieGenre = MovieGenre.create(genre);

    // Assert
    assertEquals(movieGenre.value, 'Action');
});

Deno.test('[Unit] - MovieGenre - create - single character - throws InvalidMovieGenre', () => {
    // Arrange
    const invalidGenre = 'A';

    // Act & Assert
    assertThrows(
        () => MovieGenre.create(invalidGenre),
        InvalidMovieGenre,
    );
});

Deno.test('[Unit] - MovieGenre - create - empty input - throws InvalidMovieGenre', () => {
    // Act & Assert
    assertThrows(
        () => MovieGenre.create(''),
        InvalidMovieGenre,
    );
});

Deno.test('[Unit] - MovieGenre - equals - same value - returns true', () => {
    // Arrange
    const left = MovieGenre.create('Action');
    const right = MovieGenre.create('Action');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - MovieGenre - equals - different value - returns false', () => {
    // Arrange
    const left = MovieGenre.create('Action');
    const right = MovieGenre.create('Comedy');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
