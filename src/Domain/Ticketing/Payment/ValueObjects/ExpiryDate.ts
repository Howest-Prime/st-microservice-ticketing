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

    public static createFromDate(date: Date): ExpiryDate {
        const month = date.getUTCMonth() + 1; // getUTCMonth returns 0-11
        const year = date.getUTCFullYear();
        return this.create(month, year);
    }

    public validate(): void {
        if (isNaN(this._month) || isNaN(this._year) || this._month < 1 || this._month > 12) {
            throw new InvalidExpiryDateException(this._month, this._year);
        }
    }

    public equals(other: ExpiryDate): boolean {
        return other instanceof ExpiryDate &&
            this._month === other._month &&
            this._year === other._year;
    }

    public get expiryMonth(): number {
        return this._month;
    }

    public get expiryYear(): number {
        return this._year;
    }

    public expiryDateString(): string {
        const monthString = this._month.toString().padStart(2, '0');
        const yearString = this._year.toString().slice(-2);
        return `${monthString}/${yearString}`;
    }
}
