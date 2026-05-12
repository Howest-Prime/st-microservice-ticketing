import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidMovieTitle extends DomainException{
    public constructor(title: string, minCharacters: number){
        super(`Movie Title ${title} is invalid. The title must contain at least ${minCharacters} characters`)
    }
}