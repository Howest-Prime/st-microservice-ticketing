import type { Document } from '@mongodb';
import {
    type DocumentMapper,
    serializeObjectToDocument,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { Order } from '@/Domain/Ticketing/Order/Order.ts';
import { BookingId, MovieInfo, OrderId, OrderStatus, OrderStatusState, Seat, Ticket, VisitorTypeLabel } from '@/Domain/Ticketing/Order/mod.ts';
import { Money, MovieAgeRating, MovieAgeRatingValue, MovieDuration, MovieGenre, MovieId, MoviePosterUrl, MovieTitle } from '@/Domain/Ticketing/Shared/mod.ts';

export class OrderDocumentMapper implements DocumentMapper<Order> {
    toDocument(order: Order): Document {
        return serializeObjectToDocument({
            bookingId: order.bookingId.toString(),
            externalBookingId: order.externalBookingId,
            status: order.status.status,
            agreedToTerms: order.aggredToTerms,
            priceAmount: order.price.amount,
            priceCurrency: order.price.currency,
            tickets: order.tickets.map((ticket) => ({
                id: ticket.id.toString(),
                movieInfoId: ticket.movieInfo.Id.toString(),
                movieInfoTitle: ticket.movieInfo.title.value,
                movieInfoDuration: ticket.movieInfo.duration.value,
                movieInfoGenres: ticket.movieInfo.genres.map((g) => g.value),
                movieInfoAgeRating: ticket.movieInfo.ageRating.Value,
                movieInfoPosterUrl: ticket.movieInfo.posterUrl.value,
                movieInfoPriceAmount: ticket.movieInfo.price.amount,
                movieInfoPriceCurrency: ticket.movieInfo.price.currency,
                seatNumber: ticket.seat.seatNumber,
                seatVisitorType: ticket.seat.seatVisitorType,
                room: ticket.room,
                showtime: ticket.showtime.toISOString(),
                priceAmount: ticket.price.amount,
                priceCurrency: ticket.price.currency,
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
            document.priceAmount as number,
            document.priceCurrency as string,
            (document.tickets ?? []) as Document[],
        );
    }

    private reconstituteFromDocument(
        id: string,
        bookingId: string,
        externalBookingId: string,
        status: OrderStatusState,
        agreedToTerms: boolean,
        priceAmount: number,
        priceCurrency: string,
        tickets: Document[],
    ): Order {
        const order = Object.create(Order.prototype);

        order._id = OrderId.create(id);
        order._bookingId = BookingId.create(bookingId);
        order._externalBookingId = externalBookingId;
        order._status = OrderStatus.create(status ?? OrderStatusState.Open);
        order._agrreeToTerms = agreedToTerms;
        order._price = Money.create(priceAmount, priceCurrency);
        order._customer = null;
        order._domainEvents = [];
        order._tickets = tickets.map((t) => this.reconstituteTicketFromDocument(t));

        return order;
    }

    private reconstituteTicketFromDocument(t: Document): Ticket {
        const ticket = Object.create(Ticket.prototype);

        ticket._id = MovieId.create(t.id as string);
        ticket._movieInfo = MovieInfo.create(
            MovieId.create(t.movieInfoId as string),
            MovieTitle.create(t.movieInfoTitle as string),
            MovieDuration.create(t.movieInfoDuration as number),
            (t.movieInfoGenres as string[]).map((g) => MovieGenre.create(g)),
            MovieAgeRating.create(t.movieInfoAgeRating as MovieAgeRatingValue),
            MoviePosterUrl.create(t.movieInfoPosterUrl as string),
        );
        ticket._seat = Seat.create(t.seatNumber as number, t.seatVisitorType as VisitorTypeLabel);
        ticket._room = t.room as string;
        ticket._showtime = new Date(t.showtime as string);
        ticket._price = Money.create(t.priceAmount as number, t.priceCurrency as string);

        return ticket;
    }
}
