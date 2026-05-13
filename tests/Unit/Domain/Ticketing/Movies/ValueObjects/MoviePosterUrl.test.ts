import { assertEquals, assertThrows } from '@std/assert';
import { InvalidPosterUrl, MoviePosterUrl } from '@/Domain/Ticketing/Movies/mod.ts';

Deno.test('[Unit] - MoviePosterUrl - create - valid https url - returns value object', () => {
    // Arrange
    const url = 'https://example.com/poster.jpg';

    // Act
    const posterUrl = MoviePosterUrl.create(url);

    // Assert
    assertEquals(posterUrl.value, 'https://example.com/poster.jpg');
});

Deno.test('[Unit] - MoviePosterUrl - create - valid http url - returns value object', () => {
    // Arrange
    const url = 'http://example.com/poster.jpg';

    // Act
    const posterUrl = MoviePosterUrl.create(url);

    // Assert
    assertEquals(posterUrl.value, 'http://example.com/poster.jpg');
});

Deno.test('[Unit] - MoviePosterUrl - create - no protocol - throws InvalidPosterUrl', () => {
    // Arrange
    const invalidUrl = 'example.com/poster.jpg';

    // Act & Assert
    assertThrows(
        () => MoviePosterUrl.create(invalidUrl),
        InvalidPosterUrl,
    );
});

Deno.test('[Unit] - MoviePosterUrl - create - empty input - throws InvalidPosterUrl', () => {
    // Act & Assert
    assertThrows(
        () => MoviePosterUrl.create(''),
        InvalidPosterUrl,
    );
});

Deno.test('[Unit] - MoviePosterUrl - equals - same url - returns true', () => {
    // Arrange
    const left = MoviePosterUrl.create('https://example.com/poster.jpg');
    const right = MoviePosterUrl.create('https://example.com/poster.jpg');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - MoviePosterUrl - equals - different url - returns false', () => {
    // Arrange
    const left = MoviePosterUrl.create('https://example.com/poster1.jpg');
    const right = MoviePosterUrl.create('https://example.com/poster2.jpg');

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});
