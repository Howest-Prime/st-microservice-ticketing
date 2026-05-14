import { DomainException } from '@/Domain/Shared/mod.ts';


export class InvalidMovieDuration extends DomainException {
    public constructor(value: number, minMinutes: number) {
        super(`Invalid movie duration "${value}": must be at least ${minMinutes} minute(s).`);
    }
}
