import { DomainException } from '@/Domain/Shared/mod.ts';

export class CannotAcceptTermsException extends DomainException {
    public constructor() {
        super('Terms can only be accepted when the order is open.');
    }
}
