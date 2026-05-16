import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidPaymentMethodException extends DomainException {
    constructor(value: string) {
        super(`Invalid payment method: ${value}`);
    }
}