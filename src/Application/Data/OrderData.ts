import { UUID } from '@domaincrafters/std';
import { CustomerData, TicketData } from '@/Application/Data/mod.ts';

export interface OrderData {
    id: UUID;
    bookingId: UUID;
    status: string;
    price: number;
    agreeToTerms: boolean;
    customer: CustomerData | null;
    tickets: TicketData[];
}