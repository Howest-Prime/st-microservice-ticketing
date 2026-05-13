import { assertEquals } from '@std/assert';
import {
    MovieAgeRating,
    MovieAgeRatingValue,
} from '@/Domain/Ticketing/Movies/ValueObjects/MovieAgeRating.ts';

Deno.test('[Unit] - MovieAgeRating - create - All rating - returns value object with zero value', () => {
    // Act
    const ageRating = MovieAgeRating.create(MovieAgeRatingValue.All);

    // Assert
    assertEquals(ageRating.Value, 0);
});

Deno.test('[Unit] - MovieAgeRating - create - Eighteen rating - returns value object with correct value', () => {
    // Act
    const ageRating = MovieAgeRating.create(MovieAgeRatingValue.Eighteen);

    // Assert
    assertEquals(ageRating.Value, 18);
});

Deno.test('[Unit] - MovieAgeRating - create - Twelve rating - returns value object with correct value', () => {
    // Act
    const ageRating = MovieAgeRating.create(MovieAgeRatingValue.Twelve);

    // Assert
    assertEquals(ageRating.Value, 12);
});

Deno.test('[Unit] - MovieAgeRating - equals - same rating - returns true', () => {
    // Arrange
    const left = MovieAgeRating.create(MovieAgeRatingValue.Twelve);
    const right = MovieAgeRating.create(MovieAgeRatingValue.Twelve);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - MovieAgeRating - equals - different rating - returns false', () => {
    // Arrange
    const left = MovieAgeRating.create(MovieAgeRatingValue.Six);
    const right = MovieAgeRating.create(MovieAgeRatingValue.Eighteen);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - MovieAgeRating - equals - undefined other - returns false', () => {
    // Arrange
    const ageRating = MovieAgeRating.create(MovieAgeRatingValue.Twelve);

    // Act
    const result = ageRating.equals(undefined as unknown as MovieAgeRating);

    // Assert
    assertEquals(result, false);
});
