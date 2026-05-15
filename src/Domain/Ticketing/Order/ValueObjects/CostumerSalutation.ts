import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidCustomerSalutationException } from '@/Domain/Ticketing/Order/mod.ts';

export enum CustomerSalutationLabel {
    Mr = 'Mr.',
    Ms = 'Ms.',
    Mx = 'Mx.',
}

export class CustomerSalutation extends ValueObject {
    private readonly _value: CustomerSalutationLabel;

    private constructor(value: CustomerSalutationLabel) {
        super();
        this._value = value;
    }

    public static create(value: string): CustomerSalutation {
        return new CustomerSalutation(CustomerSalutation.parse(value));
    }

    private static parse(value: string): CustomerSalutationLabel {
        const match = Object.values(CustomerSalutationLabel).find(
            (label) => label === value,
        );
        if (!match) {
            throw new InvalidCustomerSalutationException(value);
        }
        return match;
    }

    get value(): CustomerSalutationLabel {
        return this._value;
    }

    override equals(other: CustomerSalutation): boolean {
        return other instanceof CustomerSalutation 
                && this._value === other._value;
    }
}