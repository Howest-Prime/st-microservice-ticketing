import { ValueObject } from '@/Domain/Shared/mod.ts';

import { InvalidMoney } from '@/Domain/Ticketing/Shared/mod.ts';

export class Money extends ValueObject {
    private readonly _amount: number;
    private readonly _currency: string;

    private constructor(amount: number, currency: string) {
        super();
        this._amount = amount;
        this._currency = currency;
    }

    public static create(amount: number, currency: string): Money {
        const money = new Money(amount, currency);
        money.validate();
        return money;
    }

    protected validate(): void {
        if (this._amount < 0) {
            throw new InvalidMoney(this._amount, this._currency);
        }
        if (!this._currency || this._currency.length !== 3) {
            throw new InvalidMoney(this._amount, this._currency);
        }
    }

    public override equals(other: ValueObject): boolean {
        return other instanceof Money &&
            this._amount === other._amount &&
            this.currency === other._currency;
    }

    public get amount(): number {
        return this._amount;
    }

    public get currency(): string {
        return this._currency;
    }
}
