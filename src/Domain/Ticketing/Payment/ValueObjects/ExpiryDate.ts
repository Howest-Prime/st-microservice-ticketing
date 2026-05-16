import { InvalidExpiryDateException } from '@/Domain/Ticketing/Payment/mod.ts';
import { ValueObject } from '@/Domain/Shared/mod.ts';

export class ExpiryDate extends ValueObject {
    private constructor(
        public readonly _month: number,
        public readonly _year: number
    ) {
        super();
    }

    public static create(month: number, year: number): ExpiryDate {
        const newExpiryDate = new ExpiryDate(month, year);
        newExpiryDate.validate();
        return newExpiryDate;
    }
    
    public validate(): void {
        if (this._month < 1 || this._month > 12) {
            throw new InvalidExpiryDateException(this._month, this._year);
        }   
    }

    public equals(other: ExpiryDate): boolean {
        return other instanceof ExpiryDate
                && this._month === other._month
                && this._year === other._year;
    }

    public get expiryMonth(): number {
        return this._month;
    }

    public get expiryYear(): number {
        return this._year;
    }
}