import { DomainException } from '@/Domain/Shared/mod.ts';

export class InvalidMovieDuration extends DomainException{
    public constructor(duration: number, minDuration: number){
        super(`Invalid Movie Duration ${duration}. The minimum duration is ${minDuration} minutes.`)
    }
}