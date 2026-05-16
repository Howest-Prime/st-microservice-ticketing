import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidPaymentAmountException } from '@/Domain/Ticketing/Payment/mod.ts';

export class PaymentAmount extends ValueObject {
    private constructor(
        public readonly _value: number,
    ) {
        super();
    }

    public static create(value: number): PaymentAmount {
        const newPaymentAmount = new PaymentAmount(value);
        newPaymentAmount.validate();
        return newPaymentAmount;
    }

    private validate(): void {
        if (!Number.isFinite(this._value) || this._value <= 0) {
            throw new InvalidPaymentAmountException(this._value);
        }
    }
    public equals(other: PaymentAmount): boolean {
        return other instanceof PaymentAmount &&
            this._value === other._value;
    }

    public get amount(): number {
        return this._value;
    }
}
