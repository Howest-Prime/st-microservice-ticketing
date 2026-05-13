import { DomainException } from '@/Domain/Shared/mod.ts';


export class InvalidTicketCountException extends DomainException {
    public constructor(expected: number, actual: number) {
        super(`Expected ${expected} ticket(s) based on visitor count, but got ${actual}.`);
    }
}
