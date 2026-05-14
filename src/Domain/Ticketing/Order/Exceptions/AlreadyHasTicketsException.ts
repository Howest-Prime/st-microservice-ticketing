import { DomainException } from '@/Domain/Shared/mod.ts';


export class AlreadyHasTicketsException extends DomainException {
    public constructor() {
        super('Order already has tickets assigned to it.');
    }
}
