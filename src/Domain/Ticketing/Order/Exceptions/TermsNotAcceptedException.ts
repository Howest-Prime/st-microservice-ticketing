import { DomainException } from '@/Domain/Shared/mod.ts';

export class TermsNotAcceptedException extends DomainException {
    public constructor() {
        super('Terms must be accepted before proceeding.');
    }
}
