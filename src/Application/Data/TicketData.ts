import { UUID } from '@domaincrafters/std';

export interface TicketData {
    ticketId: UUID,
    seatNumber: number,
    VisitorType: string,
    price: number,
    movieId: UUID,
    room: string, 
    showtime: Date
}