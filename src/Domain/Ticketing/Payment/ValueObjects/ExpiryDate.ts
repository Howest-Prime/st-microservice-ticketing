import { InvalidExpiryDateException } from '@/Domain/Ticketing/Payment/mod.ts';
import { ValueObject } from '@/Domain/Shared/mod.ts';

export class ExpiryDate extends ValueObject {
    private constructor(
        public readonly month: number,
        public readonly year: number
    ) {
        super();
    }

    public static create(month: number, year: number): ExpiryDate {
        const newExpiryDate = new ExpiryDate(month, year);
        newExpiryDate.validate();
        return newExpiryDate;
    }
    
    public validate(): void {
        if (this.month < 1 || this.month > 12) {
            throw new InvalidExpiryDateException(this.month, this.year);
        }   
    }

    public equals(other: ExpiryDate): boolean {
        return other instanceof ExpiryDate
                && this.month === other.month
                && this.year === other.year;
    }

    public get expiryMonth(): number {
        return this.month;
    }

    public get expiryYear(): number {
        return this.year;
    }
}