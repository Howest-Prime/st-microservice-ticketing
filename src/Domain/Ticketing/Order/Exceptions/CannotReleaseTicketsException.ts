import { DomainException } from '@/Domain/Shared/mod.ts';

export class CannotReleaseTicketsException extends DomainException {
    public constructor() {
        super('Tickets can only be released when the order is paid.');
    }
}
