import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidOrderStatusTransition } from '@/Domain/Ticketing/Order/mod.ts';

export enum OrderStatusState {
    Open = 'Open',
    Paid = 'Paid',
    TicketReleased = 'TicketReleased',
    Cancelled = 'Cancelled'
}

export class OrderStatus extends ValueObject {
    private readonly _status: OrderStatusState;

    private constructor(value: OrderStatusState) {
        super();
        this._status = value;
    }

    public static create(value: OrderStatusState): OrderStatus {
        return new OrderStatus(value);
    }

    public transitionTo(targetStatus: OrderStatus): OrderStatus {
        if (this.equals(targetStatus)) {
            throw new InvalidOrderStatusTransition('The order is already in this status');
        } else if (!this.canTransitionTo(targetStatus)) {
            throw new InvalidOrderStatusTransition('Invalid order transition');
        } else {
            return targetStatus;
        }
    }

    private canTransitionTo(newStatus: OrderStatus): boolean {
        const validTransitions: Record<OrderStatusState, OrderStatusState[]> = {
            [OrderStatusState.Open]: [OrderStatusState.Paid, OrderStatusState.Cancelled],
            [OrderStatusState.Paid]: [OrderStatusState.TicketReleased],
            [OrderStatusState.TicketReleased]: [],
            [OrderStatusState.Cancelled]: [],
        };

        return validTransitions[this._status]?.includes(newStatus._status) ?? false;
    }

    public override equals(other: OrderStatus): boolean {
        return other instanceof OrderStatus && this._status === other._status;
    }

    public get status(): OrderStatusState {
        return this._status;
    }

    public isOpen(): boolean {
        return this.equals(OrderStatus.Open);
    }

    public isPaid(): boolean {
        return this.equals(OrderStatus.Paid);
    }

    public static Open = OrderStatus.create(OrderStatusState.Open);
    public static Paid = OrderStatus.create(OrderStatusState.Paid);
    public static TicketReleased = OrderStatus.create(OrderStatusState.TicketReleased);
    public static Cancelled = OrderStatus.create(OrderStatusState.Cancelled);
}
