import { ValueObject } from '@/Domain/Shared/mod.ts';
import { InvalidNameException } from '@/Domain/Ticketing/Order/mod.ts';

export abstract class Name extends ValueObject {
    private readonly _name: string;

    protected constructor(name: string) {
        super();
        this._name = name;
        this.validate();
    }

    private validate(): void {
        if (this._name.trim().length <= 0) {
            throw new InvalidNameException();
        }
    }

    public get name(): string {
        return this._name;
    }
}

export class FirstName extends Name {
    private constructor(firstName: string) {
        super(firstName);
    }

    public static create(firstName: string) {
        return new FirstName(firstName);
    }

    public override equals(other: FirstName): boolean {
        return other instanceof FirstName &&
            this.name === other.name;
    }
}

export class LastName extends Name {
    private constructor(lastName: string) {
        super(lastName);
    }

    public static create(lastName: string) {
        return new LastName(lastName);
    }

    public override equals(other: LastName): boolean {
        return other instanceof LastName &&
            this.name === other.name;
    }
}
