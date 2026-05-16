import { InvalidCVVException } from '@/Domain/Ticketing/Payment/mod.ts';
import { ValueObject } from '@/Domain/Shared/mod.ts';

export class CVV extends ValueObject {
    private constructor(
        public readonly _value: string,
    ) {
        super();
    }

    public static create(value: string): CVV {
        const newCVV = new CVV(value);
        newCVV.validate();
        return newCVV;
    }

    public validate(): void {
        if (!this._value || this._value.length < 3 || this._value.length > 4) {
            throw new InvalidCVVException(this._value);
        }
    }

    public equals(other: CVV): boolean {
        return other instanceof CVV &&
            this._value === other._value;
    }

    public get cvv(): string {
        return this._value;
    }
}
