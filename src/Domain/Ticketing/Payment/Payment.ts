import { AggregateRoot } from '@/Domain/Shared/mod.ts';
import {
    BookingId,
    CardNumber,
    CVV,
    ExpiryDate,
    ExternalId,
    OrderId,
    PaymentAmount,
    PaymentFailed,
    PaymentId,
    PaymentMethod,
    PaymentStatus,
    PaymentSucceeeded,
} from '@/Domain/Ticketing/Payment/mod.ts';

export class Payment extends AggregateRoot<PaymentId> {
    private readonly _externalId: ExternalId;
    private readonly _paymentMethod: PaymentMethod;
    private readonly _cardNumber: CardNumber;
    private readonly _expiryDate: ExpiryDate;
    private readonly _cvv: CVV;
    private readonly _orderId: OrderId;
    private readonly _bookingId: BookingId;
    private readonly _externalBookingId: string;
    private readonly _amount: PaymentAmount;
    private _status: PaymentStatus = PaymentStatus.Pending;

    private constructor(
        id: PaymentId,
        externalId: ExternalId,
        paymentMethod: PaymentMethod,
        cardNumber: CardNumber,
        expiryDate: ExpiryDate,
        cvv: CVV,
        orderId: OrderId,
        bookingId: BookingId,
        externalBookingId: string,
        amount: PaymentAmount,
    ) {
        super(id);
        this._externalId = externalId;
        this._paymentMethod = paymentMethod;
        this._cardNumber = cardNumber;
        this._expiryDate = expiryDate;
        this._cvv = cvv;
        this._orderId = orderId;
        this._bookingId = bookingId;
        this._externalBookingId = externalBookingId;
        this._amount = amount;
    }

    public static create(
        externalId: ExternalId,
        paymentMethod: PaymentMethod,
        cardNumber: CardNumber,
        expiryDate: ExpiryDate,
        cvv: CVV,
        orderId: OrderId,
        bookingId: BookingId,
        externalBookingId: string,
        amount: PaymentAmount,
    ): Payment {
        const id = PaymentId.create();
        return new Payment(
            id,
            externalId,
            paymentMethod,
            cardNumber,
            expiryDate,
            cvv,
            orderId,
            bookingId,
            externalBookingId,
            amount,
        );
    }

    public handlePayment(success: boolean, failureReason?: string): void {
        if (success) {
            this.markAsSucceeded();
            this.raise(
                PaymentSucceeeded.create(
                    this.id.value,
                    this.orderId.value,
                    this.externalBookingId,
                ),
            );
        } else {
            this.markAsFailed();
            this.raise(
                PaymentFailed.create(
                    this.id.value,
                    this.orderId.value,
                    this.externalBookingId,
                    failureReason || 'Unknown reason',
                ),
            );

          //  throw new PaymentFailedException(this.id.value, failureReason || 'Unknown reason');
        }
    }

    public markAsFailed(): void {
        this._status = this._status.transitionTo(PaymentStatus.Failed);
    }

    public markAsSucceeded(): void {
        this._status = this._status.transitionTo(PaymentStatus.Success);
    }

    public get externalId(): ExternalId {
        return this._externalId;
    }

    public get paymentMethod(): PaymentMethod {
        return this._paymentMethod;
    }

    public get cardNumber(): CardNumber {
        return this._cardNumber;
    }

    public get expiryDate(): ExpiryDate {
        return this._expiryDate;
    }

    public get cvv(): CVV {
        return this._cvv;
    }

    public get orderId(): OrderId {
        return this._orderId;
    }

    public get bookingId(): BookingId {
        return this._bookingId;
    }

    public get amount(): PaymentAmount {
        return this._amount;
    }

    public get status(): PaymentStatus {
        return this._status;
    }

    public get externalBookingId(): string {
        return this._externalBookingId;
    }
}
