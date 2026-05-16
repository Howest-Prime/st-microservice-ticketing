import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidPaymentAmountException } from '@/Domain/Ticketing/Payment/mod.ts';

export class PaymentAmount extends ValueObject {
    private constructor(
        public readonly value: number
    ) {
        super();
    }

    public static create(value: number): PaymentAmount {
        if (value <= 0) {
            throw new InvalidPaymentAmountException(value);
        }
        return new PaymentAmount(value);
    }

    public equals(other: PaymentAmount): boolean {
        return other instanceof PaymentAmount
                && this.value === other.value;
    }

    public get amount(): number {
        return this.value;
    }
}

