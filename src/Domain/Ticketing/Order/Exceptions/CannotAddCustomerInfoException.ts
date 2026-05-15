import { DomainException } from '@/Domain/Shared/mod.ts';

export class CannotAddCustomerInfoException extends DomainException {
    public constructor() {
        super('Customer information can only be added when the order is open.');
    }
}
