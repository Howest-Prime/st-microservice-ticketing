import { Email } from '@/Domain/Shared/mod.ts';

export class CustomerEmail extends Email {
    private constructor(value: string) {
        super(value);
    }

    public static override create(value: string): CustomerEmail {
        const normalized = value.trim().toLowerCase();
        const instance = new CustomerEmail(normalized);
        instance.validate();
        return instance;
    }

    public override equals(other: CustomerEmail): boolean {
        return other instanceof CustomerEmail && this.value === other.value;
    }
}
