import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidCVVException extends DomainException {
    constructor(value: string) {
        super(`Invalid CVV: ${value}`);
    }
}