import { DomainException } from '@/Domain/Shared/mod.ts';

export class CustomerAlreadyAssignedException extends DomainException {
    public constructor(orderId: string) {
        super(`Customer already assigned to order ${orderId}`);
    }
}