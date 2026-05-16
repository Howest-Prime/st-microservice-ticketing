import { ValueObject } from '@/Domain/Shared/mod.ts';
import {
    CustomerEmail,
    CustomerSalutation,
    FirstName,
    LastName,
} from '@/Domain/Ticketing/Order/mod.ts';

export class Customer extends ValueObject {
    private readonly _salutation: CustomerSalutation;
    private readonly _firstName: FirstName;
    private readonly _lastName: LastName;
    private readonly _email: CustomerEmail;

    private constructor(
        salutation: CustomerSalutation,
        firstName: FirstName,
        lastName: LastName,
        email: CustomerEmail,
    ) {
        super();
        this._salutation = salutation;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
    }

    public static create(
        salutation: CustomerSalutation,
        firstName: FirstName,
        lastName: LastName,
        email: CustomerEmail,
    ): Customer {
        return new Customer(salutation, firstName, lastName, email);
    }

    public override equals(other: Customer): boolean {
        return other instanceof Customer &&
            this._salutation === other._salutation &&
            this._firstName.equals(other._firstName) &&
            this._lastName.equals(other._lastName) &&
            this._email.equals(other._email);
    }

    public get salutation(): CustomerSalutation {
        return this._salutation;
    }

    public get firstName(): FirstName {
        return this._firstName;
    }

    public get lastName(): LastName {
        return this._lastName;
    }

    public get email(): CustomerEmail {
        return this._email;
    }
}
