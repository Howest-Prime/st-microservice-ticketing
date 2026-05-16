import { InvalidCardNumberException } from '@/Domain/Ticketing/Payment/mod.ts';
import { ValueObject } from '@/Domain/Shared/mod.ts';

export class CardNumber extends ValueObject {
    private constructor(
        public readonly value: string,
    ) {
        super();
    }

    public static create(value: string): CardNumber {
        const newCardNumber = new CardNumber(value);
        newCardNumber.validate();
        return newCardNumber;
    }

    public validate(): void {
        if (!this.value || this.value.length < 13) {
            throw new InvalidCardNumberException(this.value);
        }
    }

    public equals(other: CardNumber): boolean {
        return other instanceof CardNumber
                && this.value === other.value;
    }

    public get cardNumber(): string {
        return this.value;
    }
}