import { DomainException } from '@/Domain/Shared/mod.ts';

export class CannotPayOrderException extends DomainException {
    public constructor() {
        super('An order can only be paid when it is open.');
    }
}
