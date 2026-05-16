import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidMovieGenre extends DomainException {
    public constructor(value: string, minLength: number) {
        super(`Invalid movie genre "${value}": must be at least ${minLength} characters.`);
    }
}

export class InvalidGenresException extends DomainException {
    public constructor() {
        super('A movie must have at least one genre.');
    }
}
