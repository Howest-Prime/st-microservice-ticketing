import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidNameException extends DomainException {
    public constructor() {
        super(`Invalid Name. Name should be non empty.`);
    }
}
