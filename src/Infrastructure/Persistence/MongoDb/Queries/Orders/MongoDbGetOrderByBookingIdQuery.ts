import { GetOrderByBookingIdData, GetOrderByBookingIdQuery } from '@/Application/Ports/Queries/mod.ts';
import { MongoDbClient } from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { Optional, UUID } from '@domaincrafters/std';
import { Document } from '@mongodb';
import { CustomerData, TicketData } from '@/Application/Data/mod.ts';

export class MongoDbGetOrderByBookingIdQuery implements GetOrderByBookingIdQuery {
    private static readonly _collectionName = 'orders';

    public constructor(
        private readonly _client: MongoDbClient
    ) {}

    public async fetch(bookingId: string): Promise<Optional<GetOrderByBookingIdData>> {
        const optional = await this._client.findDocument(
            { bookingId },
            MongoDbGetOrderByBookingIdQuery._collectionName
        );

        if (optional.isPresent) {
            return Optional.of<GetOrderByBookingIdData>(
                this.mapToData(optional.value)
            );
        }

        return Optional.empty<GetOrderByBookingIdData>();
    }

    private mapToData(doc: Document): GetOrderByBookingIdData {
        const tickets = (doc.tickets ?? []) as Document[];
        const totalPrice = tickets.reduce((sum: number, t: Document) => {
            const price = t.price as Document;
            return sum + ((price?.amount as number) ?? 0);
        }, 0);

        return {
            id: this.parseUUID((doc.id ?? doc._id) as string),
            bookingId: this.parseUUID(doc.bookingId as string),
            status: doc.status as string,
            price: totalPrice,
            customer: doc.customer
                ? this.mapCustomer(doc.customer as Document)
                : null,
            tickets: tickets.map((t) => this.mapTicket(t)),
        };
    }

    private mapCustomer(customer: Document): CustomerData {
        return {
            salutation: customer.salutation as string,
            firstName: customer.firstName as string,
            lastName: customer.lastName as string,
            email: customer.email as string,
        };
    }

    private mapTicket(t: Document): TicketData {
        const seat = t.seat as Document;
        const price = t.price as Document;
        const movieInfo = t.movieInfo as Document;

        return {
            ticketId: this.parseUUID(t.id as string),
            seatNumber: seat.number as number,
            VisitorType: seat.visitorType as string,
            price: price.amount as number,
            movieId: this.parseUUID(movieInfo.id as string),
            room: t.room as string,
            showtime: new Date(t.showtime as string),
        };
    }

    private parseUUID(value: string): UUID {
        return UUID.parse(value);
    }
}