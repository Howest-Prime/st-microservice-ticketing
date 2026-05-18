import { assertEquals } from '@std/assert';
import { TicketId } from '@/Domain/Ticketing/Order/Ticket.ts';
import { Seat, Ticket, VisitorTypeLabel } from '@/Domain/Ticketing/Order/mod.ts';
import { MovieInfo } from '@/Domain/Ticketing/Order/ValueObjects/MovieInfo.ts';
import {
    MovieAgeRating,
    MovieDuration,
    MovieGenre,
    MovieId,
    MoviePosterUrl,
    MovieTitle,
} from '@/Domain/Ticketing/Shared/mod.ts';
import { MovieAgeRatingValue } from '@/Domain/Ticketing/Shared/ValueObjects/MovieAgeRating.ts';

const makeMovieInfo = () =>
    MovieInfo.create(
        MovieId.create(),
        MovieTitle.create('Inception'),
        MovieDuration.create(120),
        [MovieGenre.create('Action')],
        MovieAgeRating.create(MovieAgeRatingValue.Twelve),
        MoviePosterUrl.create('https://example.com/inception.jpg'),
    );

const showtime = new Date('2026-12-01T20:00:00Z');

Deno.test('[Unit] - Ticket - create - standard visitor - returns ticket with full price', () => {
    // Arrange
    const movieInfo = makeMovieInfo();
    const seat = Seat.create(1, VisitorTypeLabel.Standard);

    // Act
    const ticket = Ticket.create(movieInfo, seat, 'Room A', showtime);

    // Assert
    assertEquals(ticket.seat.seatNumber, 1);
    assertEquals(ticket.seat.seatVisitorType, VisitorTypeLabel.Standard);
    assertEquals(ticket.room, 'Room A');
    assertEquals(ticket.showtime, showtime);
    assertEquals(ticket.price.amount, 18); // 120 * 0.15
    assertEquals(ticket.price.currency, 'EUR');
});

Deno.test('[Unit] - Ticket - create - discounted visitor - returns ticket with 10% discount', () => {
    // Arrange
    const movieInfo = makeMovieInfo();
    const seat = Seat.create(2, VisitorTypeLabel.Discounted);

    // Act
    const ticket = Ticket.create(movieInfo, seat, 'Room A', showtime);

    // Assert
    assertEquals(ticket.seat.seatVisitorType, VisitorTypeLabel.Discounted);
    assertEquals(ticket.price.amount, 16.2); // 18 * 0.9
    assertEquals(ticket.price.currency, 'EUR');
});

Deno.test('[Unit] - Ticket - create - two tickets - have different ids', () => {
    // Arrange
    const movieInfo = makeMovieInfo();

    // Act
    const first = Ticket.create(movieInfo, Seat.create(1, VisitorTypeLabel.Standard), 'Room A', showtime);
    const second = Ticket.create(movieInfo, Seat.create(2, VisitorTypeLabel.Standard), 'Room A', showtime);

    // Assert
    assertEquals(first.id.equals(second.id), false);
});

Deno.test('[Unit] - Ticket - create - carries correct movie info', () => {
    // Arrange
    const movieInfo = makeMovieInfo();
    const seat = Seat.create(3, VisitorTypeLabel.Standard);

    // Act
    const ticket = Ticket.create(movieInfo, seat, 'Room B', showtime);

    // Assert
    assertEquals(ticket.movieInfo.title.value, 'Inception');
    assertEquals(ticket.movieInfo.duration.value, 120);
});

Deno.test('[Unit] - TicketId - create - without argument - creates new unique id', () => {
    // Act
    const first = TicketId.create();
    const second = TicketId.create();

    // Assert
    assertEquals(first.equals(second), false);
    assertEquals(typeof first.value, 'string');
});

Deno.test('[Unit] - TicketId - create - with explicit id - uses provided id', () => {
    // Arrange
    const existingId = TicketId.create().value;

    // Act
    const id = TicketId.create(existingId);

    // Assert
    assertEquals(id.value, existingId);
});
