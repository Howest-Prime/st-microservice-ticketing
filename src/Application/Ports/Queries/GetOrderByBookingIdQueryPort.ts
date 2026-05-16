import type { Optional, UUID } from '@domaincrafters/std';
import { CustomerData, TicketData } from '@/Application/Data/mod.ts';

export interface GetOrderByBookingIdData {
    id: UUID;
    bookingId: UUID;
    status: string;
    price: number;
    customer: CustomerData | null;
    tickets: TicketData[];
}

export interface GetOrderByBookingIdQuery {
    fetch(bookingId: string): Promise<Optional<GetOrderByBookingIdData>>;
}