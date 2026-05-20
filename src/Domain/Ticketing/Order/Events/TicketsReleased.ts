import { EventFQDN } from '@/Domain/Shared/mod.ts';
import { OrderDomainEvent } from './OrderDomainEvent.ts';

export interface ReleasedTicket {
    ticketId: string;
    movieId: string;
    room: string;
    seatNumber: number;
    visitorType: string;
    price: number;
    showtime: string;
}

export interface ReleasedCustomer {
    salutation: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
}

export class TicketsReleased extends OrderDomainEvent {
    public static readonly FQDN: EventFQDN = EventFQDN.create(
        `${OrderDomainEvent.FQDN_PREFIX}.ticketsreleased`,
    );

    private readonly _occurredOn: Date;

    private constructor(
        private readonly _orderId: string,
        private readonly _customer: ReleasedCustomer | null,
        private readonly _tickets: ReleasedTicket[],
    ) {
        super();
        this._occurredOn = new Date();
    }

    public static create(
        orderId: string,
        customer: ReleasedCustomer | null,
        tickets: ReleasedTicket[],
    ): TicketsReleased {
        return new TicketsReleased(orderId, customer, tickets);
    }

    public override get FQDN(): EventFQDN {
        return TicketsReleased.FQDN;
    }

    public override get occurredOn(): Date {
        return this._occurredOn;
    }

    public get orderId(): string {
        return this._orderId;
    }

    public get customer(): ReleasedCustomer | null {
        return this._customer;
    }

    public get tickets(): ReleasedTicket[] {
        return this._tickets;
    }
}
