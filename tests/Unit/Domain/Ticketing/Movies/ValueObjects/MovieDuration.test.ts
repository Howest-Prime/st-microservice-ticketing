import { assertEquals, assertThrows } from '@std/assert';
import { InvalidMovieDuration, MovieDuration } from '@/Domain/Ticketing/Movies/mod.ts';

Deno.test('[Unit] - MovieDuration - create - valid input - returns value object', () => {
    // Arrange
    const duration = 120;

    // Act
    const movieDuration = MovieDuration.create(duration);

    // Assert
    assertEquals(movieDuration.value, 120);
});

Deno.test('[Unit] - MovieDuration - create - zero - throws InvalidMovieDuration', () => {
    // Act & Assert
    assertThrows(
        () => MovieDuration.create(0),
        InvalidMovieDuration,
    );
});

Deno.test('[Unit] - MovieDuration - create - negative value - throws InvalidMovieDuration', () => {
    // Act & Assert
    assertThrows(
        () => MovieDuration.create(-10),
        InvalidMovieDuration,
    );
});

Deno.test('[Unit] - MovieDuration - hasIntermission - duration over 100 minutes - returns true', () => {
    // Arrange
    const movieDuration = MovieDuration.create(101);

    // Act
    const result = movieDuration.hasIntermission();

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - MovieDuration - hasIntermission - duration of exactly 100 minutes - returns false', () => {
    // Arrange
    const movieDuration = MovieDuration.create(100);

    // Act
    const result = movieDuration.hasIntermission();

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - MovieDuration - intermissionDuration - returns 10 minutes', () => {
    // Arrange
    const movieDuration = MovieDuration.create(150);

    // Act
    const result = movieDuration.intermissionDuration;

    // Assert
    assertEquals(result, 10);
});

Deno.test('[Unit] - MovieDuration - equals - same value - returns true', () => {
    // Arrange
    const left = MovieDuration.create(120);
    const right = MovieDuration.create(120);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - MovieDuration - equals - different value - returns false', () => {
    // Arrange
    const left = MovieDuration.create(90);
    const right = MovieDuration.create(120);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
