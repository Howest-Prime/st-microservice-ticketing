import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidPaymentTransitionException extends DomainException {
    constructor(from: string, to: string) {
        super(`Invalid payment transition from ${from} to ${to}`);
    }
}
