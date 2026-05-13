import { DomainException } from '@/Domain/Shared/mod.ts';


export class InvalidSeatException extends DomainException {
    public constructor(seatNr: number) {
        super(`Invalid SeatNumber ${seatNr}. Seat number must be a positive and greater than 0.`)
    }
}