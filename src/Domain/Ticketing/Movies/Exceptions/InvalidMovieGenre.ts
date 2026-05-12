import { DomainException } from '@/Domain/Shared/mod.ts';


export class InvalidMovieGenre extends DomainException {
    public constructor(genre: string, minLength: number) {
       super(`The genre "${genre}" is invalid. Expected a minimum length of ${minLength} characters.`)
    }
}