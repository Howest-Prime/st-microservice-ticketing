import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidExpiryDateException extends DomainException {
    constructor(month: number, year: number) {
        super(`Invalid expiry date: ${month}/${year}`);
    }
}