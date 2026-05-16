import { InvalidCardNumberException } from '@/Domain/Ticketing/Payment/mod.ts';
import { ValueObject } from '@/Domain/Shared/mod.ts';

export class CardNumber extends ValueObject {
    private constructor(
        public readonly _value: string,
    ) {
        super();
    }

    public static create(value: string): CardNumber {
        const newCardNumber = new CardNumber(value);
        newCardNumber.validate();
        return newCardNumber;
    }

    public validate(): void {
        if (!this._value || this._value.length < 12 || this._value.length > 19) {
            throw new InvalidCardNumberException(this._value);
        }
    }

    public equals(other: CardNumber): boolean {
        return other instanceof CardNumber
                && this._value === other._value;
    }

    public get cardNumber(): string {
        return this._value;
    }
}