import { AggregateRoot } from '@/Domain/Shared/mod.ts';
import {
    BookingId,
    CannotAcceptTermsException,
    CannotAddCustomerInfoException,
    CannotCancelOrderException,
    CannotPayOrderException,
    CannotReleaseTicketsException,
    Customer,
    InvalidTicketCountException,
    OrderId,
    OrderMustHaveAtLeastOneTicketException,
    OrderPaid,
    OrderStatus,
    TermsNotAcceptedException,
    Ticket,
    VisitorTypeLabel,
} from '@/Domain/Ticketing/Order/mod.ts';
import { Money } from '@/Domain/Ticketing/Shared/mod.ts';

export class Order extends AggregateRoot<OrderId> {
    private readonly _bookingId: BookingId;
    private readonly _externalBookingId: string;
    private _customer: Customer | null = null;
    private readonly _tickets: Ticket[];
    private _status: OrderStatus = OrderStatus.Open;
    private _agrreeToTerms: boolean = false;

    private readonly _price: Money;

    private constructor(
        orderId: OrderId,
        bookingId: BookingId,
        externalBookingId: string,
        tickets: Ticket[],
    ) {
        super(orderId);
        this._bookingId = bookingId;
        this._externalBookingId = externalBookingId;
        this._tickets = tickets;
        const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.price.amount, 0);
        this._price = Money.create(totalAmount, 'EUR');
    }

    public static create(externalBookingId: string, tickets: Ticket[]): Order {
        const newOrder = new Order(
            OrderId.create(),
            BookingId.create(),
            externalBookingId,
            tickets,
        );
        newOrder.validate();
        return newOrder;
    }

    public pay(): void {
        if (!this.isStatusOpen()) throw new CannotPayOrderException();
        if (!this.isTermsAccepted()) throw new TermsNotAcceptedException();
        this._status = this._status.transitionTo(OrderStatus.Paid);
        this.raise(OrderPaid.create(this.id.value, this._bookingId.value));
    }

    public releaseTickets(): void {
        if (!this.isStatusPaid()) throw new CannotReleaseTicketsException();
        this._status = this.status.transitionTo(OrderStatus.TicketReleased);
    }

    public cancel(): void {
        if (!this.isStatusOpen()) throw new CannotCancelOrderException();
        this._status = this.status.transitionTo(OrderStatus.Cancelled);
    }

    public acceptTerms(): void {
        if (!this.isStatusOpen()) throw new CannotAcceptTermsException();
        this._agrreeToTerms = true;
    }

    public acceptTermsIfAgreed(agreed: boolean): void {
        if (agreed) this.acceptTerms();
    }

    public addCustomerInfomations(customer: Customer): void {
        if (!this.isStatusOpen()) throw new CannotAddCustomerInfoException();
        if (!this.isTermsAccepted()) throw new TermsNotAcceptedException();
        this._customer = customer;
    }

    public isStatusOpen(): boolean {
        return this._status.equals(OrderStatus.Open);
    }

    public isStatusPaid(): boolean {
        return this._status.equals(OrderStatus.Paid);
    }

    public isTermsAccepted(): boolean {
        return this._agrreeToTerms === true;
    }

    public isCustomerAssigned(): boolean {
        return this._customer instanceof Customer;
    }

    private validate(): void {
        if (this._tickets.length === 0) {
            throw new OrderMustHaveAtLeastOneTicketException();
        }
        this.ensureOrderHasValidSeats();
    }

    private ensureOrderHasValidSeats(): void {
        const seatNumbers = this._tickets.map((t) => t.seat.seatNumber);
        const standardVisitors =
            this._tickets.filter((t) => t.seat.seatVisitorType === VisitorTypeLabel.Standard)
                .length;
        const discountedVisitors =
            this._tickets.filter((t) => t.seat.seatVisitorType === VisitorTypeLabel.Discounted)
                .length;
        const uniqueSeats = new Set(seatNumbers).size;

        if (uniqueSeats !== standardVisitors + discountedVisitors) {
            throw new InvalidTicketCountException(
                standardVisitors + discountedVisitors,
                uniqueSeats,
            );
        }
    }

    public get bookingId(): BookingId {
        return this._bookingId;
    }

    public get externalBookingId(): string {
        return this._externalBookingId;
    }

    public get customer(): Customer | null {
        return this._customer;
    }

    public get tickets(): Ticket[] {
        return [...this._tickets];
    }

    public get status(): OrderStatus {
        return this._status;
    }

    public get price(): Money {
        return this._price;
    }

    public get aggredToTerms(): boolean {
        return this._agrreeToTerms;
    }
}
