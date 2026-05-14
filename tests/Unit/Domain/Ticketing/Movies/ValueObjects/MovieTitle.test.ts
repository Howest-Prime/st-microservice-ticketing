import { assertEquals, assertThrows } from '@std/assert';
import { InvalidMovieTitle, MovieTitle } from '@/Domain/Ticketing/Shared/mod.ts';

Deno.test('[Unit] - MovieTitle - create - valid input - returns value object', () => {
    // Arrange
    const rawTitle = 'Inception';

    // Act
    const movieTitle = MovieTitle.create(rawTitle);

    // Assert
    assertEquals(movieTitle.value, 'Inception');
});

Deno.test('[Unit] - MovieTitle - create - too short - throws InvalidMovieTitle', () => {
    // Arrange
    const invalidTitle = 'abc';

    // Act & Assert
    assertThrows(
        () => MovieTitle.create(invalidTitle),
        InvalidMovieTitle,
    );
});

Deno.test('[Unit] - MovieTitle - create - empty input - throws InvalidMovieTitle', () => {
    // Arrange
    const invalidTitle = '';

    // Act & Assert
    assertThrows(
        () => MovieTitle.create(invalidTitle),
        InvalidMovieTitle,
    );
});

Deno.test('[Unit] - MovieTitle - equals - same value - returns true', () => {
    // Arrange
    const left = MovieTitle.create('Inception');
    const right = MovieTitle.create('Inception');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - MovieTitle - equals - different value - returns false', () => {
    // Arrange
    const left = MovieTitle.create('Inception');
    const right = MovieTitle.create('Interstellar');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
