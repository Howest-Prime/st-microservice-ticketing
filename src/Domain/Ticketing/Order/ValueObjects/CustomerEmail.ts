import { Email } from '@/Domain/Shared/mod.ts';

export class CustomerEmail {
    private readonly _email: Email;

    private constructor(value: string) {
        this._email = Email.create(value);
    }

    public static create(value: string): CustomerEmail {
        return new CustomerEmail(value);
    }

    get value(): string {
        return this._email.value;
    }

    equals(other: CustomerEmail): boolean {
        return this._email.equals(other._email);
    }

    toString(): string {
        return this._email.toString();
    }
}