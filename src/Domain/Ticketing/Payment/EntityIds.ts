import { UUIDEntityId } from '@/Domain/Shared/mod.ts';

export class PaymentId extends UUIDEntityId {
    private constructor(
        value?: string,
    ) {
        super(value);
    }

    public static create(value?: string): PaymentId {
        return new PaymentId(value);
    }
}

export class ExternalId extends UUIDEntityId {
    private constructor(
        value?: string,
    ) {
        super(value);
    }

    public static create(value?: string): ExternalId {
        return new ExternalId(value);
    }
}

export class OrderId extends UUIDEntityId {
    private constructor(
        value?: string,
    ) {
        super(value);
    }

    public static create(value?: string): OrderId {
        return new OrderId(value);
    }
}

export class BookingId extends UUIDEntityId {
    private constructor(
        value?: string,
    ) {
        super(value);
    }

    public static create(value?: string): BookingId {
        return new BookingId(value);
    }
}
