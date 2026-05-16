import { DomainException } from '@/Domain/Shared/mod.ts';

export class DuplicateSeatException extends DomainException {
    public constructor(seatNr: number) {
        super(`Seat number ${seatNr} appears more than once in the order.`);
    }
}
