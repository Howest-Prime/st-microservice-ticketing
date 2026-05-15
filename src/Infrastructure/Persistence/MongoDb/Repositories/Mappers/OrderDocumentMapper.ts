import type { Document } from '@mongodb';
import {
    type DocumentMapper,
    serializeObjectToDocument,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { Order } from '@/Domain/Ticketing/Order/Order.ts';
import { BookingId, Customer, CustomerEmail, CustomerSalutation, FirstName, LastName, MovieInfo, OrderId, OrderStatus, OrderStatusState, Seat, Ticket, VisitorTypeLabel } from '@/Domain/Ticketing/Order/mod.ts';
import { Money, MovieAgeRating, MovieAgeRatingValue, MovieDuration, MovieGenre, MovieId, MoviePosterUrl, MovieTitle } from '@/Domain/Ticketing/Shared/mod.ts';

export class OrderDocumentMapper implements DocumentMapper<Order> {
    toDocument(order: Order): Document {
        return serializeObjectToDocument({
            bookingId: order.bookingId.toString(),
            externalBookingId: order.externalBookingId,
            status: order.status.status,
            agreedToTerms: order.aggredToTerms,
            customer: order.customer ? {
                salutation: order.customer.salutation.value,
                firstName: order.customer.firstName.name,
                lastName: order.customer.lastName.name,
                email: order.customer.email.value,
            } : null,
            tickets: order.tickets.map((ticket) => ({
                id: ticket.id.toString(),
                movieInfo: {
                    id: ticket.movieInfo.Id.toString(),
                    title: ticket.movieInfo.title.value,
                    duration: ticket.movieInfo.duration.value,
                    genres: ticket.movieInfo.genres.map((g) => g.value),
                    ageRating: ticket.movieInfo.ageRating.Value,
                    posterUrl: ticket.movieInfo.posterUrl.value,
                    priceAmount: ticket.movieInfo.price.amount,
                    priceCurrency: ticket.movieInfo.price.currency,
                },
                seat: {
                    number: ticket.seat.seatNumber,
                    visitorType: ticket.seat.seatVisitorType,
                },
                room: ticket.room,
                showtime: ticket.showtime.toISOString(),
                price: {
                    amount: ticket.price.amount,
                    currency: ticket.price.currency,
                },
            })),
        });
    }

    reconstitute(document: Document): Order {
        return this.reconstituteFromDocument(
            (document.id ?? document._id) as string,
            document.bookingId as string,
            document.externalBookingId as string,
            document.status as OrderStatusState,
            document.agreedToTerms as boolean,
            (document.tickets ?? []) as Document[],
            (document.customer ?? null) as Document | null,
        );
    }

    private reconstituteFromDocument(
        id: string,
        bookingId: string,
        externalBookingId: string,
        status: OrderStatusState,
        agreedToTerms: boolean,
        tickets: Document[],
        customer: Document | null,
    ): Order {
        const order = Object.create(Order.prototype);

        order._id = OrderId.create(id);
        order._bookingId = BookingId.create(bookingId);
        order._externalBookingId = externalBookingId;
        order._status = OrderStatus.create(status ?? OrderStatusState.Open);
        order._agrreeToTerms = agreedToTerms;
        order._tickets = tickets.map((t) => this.reconstituteTicketFromDocument(t));
        order._price = Money.create(
            order._tickets.reduce((sum: number, t: Ticket) => sum + t.price.amount, 0),
            order._tickets[0].price.currency,
        );
        order._customer = customer ? Customer.create(
            CustomerSalutation.create(customer.salutation as string),
            FirstName.create(customer.firstName as string),
            LastName.create(customer.lastName as string),
            CustomerEmail.create(customer.email as string),
        ) : null;
        order._domainEvents = [];

        return order;
    }

    private reconstituteTicketFromDocument(t: Document): Ticket {
        const ticket = Object.create(Ticket.prototype);
        const movieInfo = t.movieInfo as Document;
        const seat = t.seat as Document;

        ticket._id = MovieId.create(t.id as string);
        ticket._movieInfo = MovieInfo.create(
            MovieId.create(movieInfo.id as string),
            MovieTitle.create(movieInfo.title as string),
            MovieDuration.create(movieInfo.duration as number),
            (movieInfo.genres as string[]).map((g) => MovieGenre.create(g)),
            MovieAgeRating.create(movieInfo.ageRating as MovieAgeRatingValue),
            MoviePosterUrl.create(movieInfo.posterUrl as string),
        );
        ticket._seat = Seat.create(seat.number as number, seat.visitorType as VisitorTypeLabel);
        ticket._room = t.room as string;
        ticket._showtime = new Date(t.showtime as string);
        ticket._price = Money.create((t.price as Document).amount as number, (t.price as Document).currency as string);

        return ticket;
    }
}
