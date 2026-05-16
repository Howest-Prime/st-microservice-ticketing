import { InvalidPaymentMethodException } from '@/Domain/Ticketing/Payment/mod.ts';
import { ValueObject } from '@/Domain/Shared/mod.ts';

export enum PaymentMethodType {
    CreditCard = 'Credit Card',
    BankTransfer = 'Bank Transfer',
}

export class PaymentMethod extends ValueObject {
    private constructor(
        public readonly _type: PaymentMethodType,
    ) {
        super();
    }

    private static create(type: PaymentMethodType): PaymentMethod {
        return new PaymentMethod(type);
    }

    public static fromString(value: string): PaymentMethod {
        const normalized = value.trim().toLowerCase();
        const type = Object.values(PaymentMethodType)
            .find((v) => v.toLowerCase() === normalized);

        if (!type) throw new InvalidPaymentMethodException(value);

        return new PaymentMethod(type);
    }

    public get paymentMethodType(): PaymentMethodType {
        return this._type;
    }

    public equals(other: PaymentMethod): boolean {
        return other instanceof PaymentMethod &&
            this._type === other._type;
    }

    public static readonly CreditCard = PaymentMethod.create(PaymentMethodType.CreditCard);
    public static readonly BankTransfer = PaymentMethod.create(PaymentMethodType.BankTransfer);
}
