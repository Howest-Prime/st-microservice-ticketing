import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidCardNumberException extends DomainException  {
    constructor(value: string) {
        super(`Invalid payment method: ${value}`);
    }
}