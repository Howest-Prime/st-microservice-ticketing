import { DomainException } from '@/Domain/Shared/mod.ts';


export class InvalidMovieTitle extends DomainException {
    public constructor(value: string, minLength: number) {
        super(`Invalid movie title "${value}": must be at least ${minLength} characters.`);
    }
}
