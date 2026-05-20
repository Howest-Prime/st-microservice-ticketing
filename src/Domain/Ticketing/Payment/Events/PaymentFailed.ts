import { PaymentDomainEvent } from '@/Domain/Ticketing/Payment/mod.ts';
import { EventFQDN } from '../../../Shared/mod.ts';

export class PaymentFailed extends PaymentDomainEvent {
    public static readonly FQDN: EventFQDN = EventFQDN.create(
        `${PaymentDomainEvent.FQDN_PREFIX}.paymentfailed`
    );

    private readonly _occurredOn: Date;

    private constructor(
        private readonly _paymentId: string,
        private readonly _orderId: string,
        private readonly _bookingId: string,
        private readonly _reason: string,
    ) {
        super();
        this._occurredOn = new Date();
    }

    public static create(
        paymentId: string,
        orderId: string,
        bookingId: string,
        reason: string,
    ): PaymentFailed {
        return new PaymentFailed(paymentId, orderId, bookingId, reason);
    }

    public override get FQDN(): EventFQDN {
        return PaymentFailed.FQDN;
    }
    override get occurredOn(): Date {
        return this._occurredOn;
    }

    public get paymentId(): string {
        return this._paymentId;
    }

    public get bookingId(): string {
        return this._bookingId;
    }

    public get orderId(): string {
        return this._orderId;
    }

    public get reason(): string {
        return this._reason;
    }
}
