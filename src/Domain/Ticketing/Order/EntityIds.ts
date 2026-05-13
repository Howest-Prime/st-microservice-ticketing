import { UUIDEntityId } from '@/Domain/Shared/mod.ts';

export class OrderId extends UUIDEntityId {
    private constructor(id?: string){
        super(id);
    }

    public static create(id?: string): OrderId {
        return new OrderId(id);
    }
}

export class BookingId extends UUIDEntityId {
    private constructor(id?: string){
        super(id);
    }

    public static create(id?: string): BookingId {
        return new BookingId(id);
    }
}