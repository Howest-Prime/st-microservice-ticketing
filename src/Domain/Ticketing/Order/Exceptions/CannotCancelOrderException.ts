import { DomainException } from '@/Domain/Shared/mod.ts';

export class CannotCancelOrderException extends DomainException {
    public constructor() {
        super('An order can only be cancelled when it is open.');
    }
}
