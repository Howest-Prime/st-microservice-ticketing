import { DomainException } from '@/Domain/Shared/mod.ts';


export class OrderMustHaveAtLeastOneTicketException extends DomainException {
    public constructor() {
        super('An order must have at least one ticket.');
    }
}
