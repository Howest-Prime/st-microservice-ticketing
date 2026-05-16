import { EventFQDN } from '@/Domain/Shared/mod.ts';
import { OrderDomainEvent } from './OrderDomainEvent.ts';

export class OrderPaid extends OrderDomainEvent {
    public static readonly FQDN: EventFQDN = EventFQDN.create(
        `${OrderDomainEvent.FQDN_PREFIX}.OrderPaid`,
    );

    private readonly _occurredOn: Date;

    private constructor(
        private readonly _orderId: string,
        private readonly _bookingId: string,
    ) {
        super();
        this._occurredOn = new Date();
    }

    public static create(orderId: string, bookingId: string): OrderPaid {
        return new OrderPaid(orderId, bookingId);
    }

    public override get FQDN(): EventFQDN {
        return OrderPaid.FQDN;
    }

    public override get occurredOn(): Date {
        return this._occurredOn;
    }

    public get orderId(): string {
        return this._orderId;
    }

    public get bookingId(): string {
        return this._bookingId;
    }
}
