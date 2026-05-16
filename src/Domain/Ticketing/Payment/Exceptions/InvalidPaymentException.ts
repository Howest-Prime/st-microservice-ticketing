import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidPaymentAmountException extends DomainException {
    constructor(value: number) {
        super(`Invalid payment method: ${value}`);
    }
}

export class InvalidPaymentStatusException extends DomainException {
    constructor(value: string) {
        super(`Invalid payment method: ${value}`);
    }
}
