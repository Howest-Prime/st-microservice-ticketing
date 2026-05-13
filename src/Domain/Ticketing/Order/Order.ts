import { AggregateRoot } from '@/Domain/Shared/mod.ts';
import { BookingId, Customer, InvalidTicketCountException, OrderId, OrderMustHaveAtLeastOneTicketException, OrderStatus, Ticket, VisitorTypeLabel } from '@/Domain/Ticketing/Order/mod.ts';
import { Money } from '@/Domain/Ticketing/Shared/mod.ts';


export class Order extends AggregateRoot<OrderId> {

    private readonly _bookingId: BookingId;
    private _customer: Customer | null = null;
    private readonly _tickets: Ticket[];
    private _status: OrderStatus = OrderStatus.Open;;
    private _agrreeToTerms: boolean = false;

    private readonly _price: Money;

    private constructor(orderId: OrderId, bookingId: BookingId, tickets: Ticket[]){
        super(orderId);
        this._bookingId = bookingId;
        this._tickets = tickets;
        const totalAmount = tickets.reduce((sum, ticket) => sum + ticket.price.amount, 0);
        this._price = Money.create(totalAmount, 'EUR');
    }

    public static create (bookingId: BookingId, tickets: Ticket[]): Order {
        const newOrder = new Order(OrderId.create(), bookingId, tickets);
        newOrder.validate();
        return newOrder;
    }

    public pay(): void {
        if(this.isStatusOpen() && this.isTermsAccepted()){
            this._status = this._status.transitionTo(OrderStatus.Paid);
        }
    }

    public releaseTickets(): void {
        if(this.isStatusPaid()){
            this._status = this.status.transitionTo(OrderStatus.TicketReleased);
        }
    }

    public cancel(): void {
        if(this.isStatusOpen()){
            this._status = this.status.transitionTo(OrderStatus.Cancelled);
        }
    }

    public acceptTerms(): void {
        if(this.isStatusOpen()){
            this._agrreeToTerms = true;
        }
    }

    public addCustomerInfomations(customer: Customer): void {
        if(this.isStatusOpen() && this.isTermsAccepted()){
            this._customer = customer;
        }
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

    public isCustomerAssigned() : boolean {
        return this._customer instanceof Customer;
    }

    private validate(): void {
        if(this._tickets.length === 0) {
            throw new OrderMustHaveAtLeastOneTicketException();
        }
        this.ensureOrderHasValidSeats();
    }

    private ensureOrderHasValidSeats(): void {
        const seatNumbers = this._tickets.map(t => t.seat.seatNumber);
        const standardVisitors = this._tickets.filter(t => t.seat.seatVisitorType === VisitorTypeLabel.Standard).length;
        const discountedVisitors = this._tickets.filter(t => t.seat.seatVisitorType === VisitorTypeLabel.Discounted).length;
        const uniqueSeats = new Set(seatNumbers).size;

        if(uniqueSeats !== standardVisitors + discountedVisitors) {
            throw new InvalidTicketCountException(standardVisitors + discountedVisitors, uniqueSeats);
        }
    }

    public get bookingId(): BookingId {
        return this._bookingId;
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