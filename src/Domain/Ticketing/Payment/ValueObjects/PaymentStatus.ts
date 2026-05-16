import {
    InvalidPaymentStatusException,
    InvalidPaymentTransitionException,
} from '@/Domain/Ticketing/Payment/mod.ts';
import { ValueObject } from '@/Domain/Shared/mod.ts';

export enum PaymentStatusState {
    Pending = 'Pending',
    Success = 'Success',
    Failed = 'Failed',
}

export class PaymentStatus extends ValueObject {
    private constructor(
        public readonly _value: PaymentStatusState,
    ) {
        super();
    }

    public static create(value: PaymentStatusState): PaymentStatus {
        const newPaymentStatus = new PaymentStatus(value);
        newPaymentStatus.validate();
        return newPaymentStatus;
    }

    public static createFromString(value: string): PaymentStatus {
        const normalized = value.toLowerCase();
        const state = Object.values(PaymentStatusState)
            .find((v) => v.toLowerCase() === normalized);

        if (!state) throw new InvalidPaymentStatusException(value);

        return new PaymentStatus(state);
    }

    public validate(): void {
        if (!Object.values(PaymentStatusState).includes(this._value)) {
            throw new InvalidPaymentStatusException(this._value);
        }
    }

    public equals(other: PaymentStatus): boolean {
        return other instanceof PaymentStatus &&
            this._value === other._value;
    }

    public transitionTo(target: PaymentStatus): PaymentStatus {
        if (!this.canTransitionTo(target)) {
            throw new InvalidPaymentTransitionException(this._value, target._value);
        }
        return target;
    }

    private canTransitionTo(target: PaymentStatus): boolean {
        const validTransitions: Record<PaymentStatusState, PaymentStatusState[]> = {
            [PaymentStatusState.Pending]: [PaymentStatusState.Success, PaymentStatusState.Failed],
            [PaymentStatusState.Success]: [],
            [PaymentStatusState.Failed]: [],
        };

        return validTransitions[this._value].includes(target._value);
    }

    public get value(): PaymentStatusState {
        return this._value;
    }

    public override toString(): string {
        return this._value;
    }

    public static readonly Pending = PaymentStatus.create(PaymentStatusState.Pending);
    public static readonly Success = PaymentStatus.create(PaymentStatusState.Success);
    public static readonly Failed = PaymentStatus.create(PaymentStatusState.Failed);
}
