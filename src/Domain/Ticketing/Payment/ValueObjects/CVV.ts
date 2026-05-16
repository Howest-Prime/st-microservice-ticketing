import { InvalidCVVException } from '@/Domain/Ticketing/Payment/mod.ts';
import { ValueObject } from '@/Domain/Shared/mod.ts';

export class CVV extends ValueObject {
    private constructor(
        public readonly value: string
    ) {
        super();
    }

    public static create(value: string): CVV {
        const newCVV = new CVV(value);
        newCVV.validate();
        return newCVV;
    }

    public validate(): void {
        if (!this.value || this.value.length < 3 || this.value.length > 4) {
            throw new InvalidCVVException(this.value);
        }
    }

    public equals(other: CVV): boolean {
        return other instanceof CVV
                && this.value === other.value;
    }

    public get cvv(): string {
        return this.value;
    }
}