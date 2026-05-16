import { DomainException } from '@/Domain/Shared/mod.ts';

export class AlreadyInStatusException extends DomainException {
    public constructor(status: string) {
        super(`Payment is already in status '${status}'`);
    }
}