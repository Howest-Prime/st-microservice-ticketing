import { ValueObject } from '@/Domain/Shared/mod.ts';

import { InvalidMovieDuration } from '@/Domain/Ticketing/Movies/mod.ts';


export class MovieDuration extends ValueObject{
    
    private static readonly _MINIMUM_MINUTES: number = 1;
    private static readonly _INTERMISSION_DURATION = 10;

    private readonly _value: number;

    private constructor(duration: number){
        super();
        this._value = duration;
    }

    public static create(duration: number): MovieDuration {
        const newMovieDuration = new MovieDuration(duration);
        newMovieDuration.validate();
        return newMovieDuration;
    }

    protected validate(): void {
        if(!this._value || this._value < MovieDuration._MINIMUM_MINUTES){
            throw new InvalidMovieDuration(this._value, MovieDuration._MINIMUM_MINUTES)
        }
    }

    public override equals(other: ValueObject): boolean {
        return other instanceof MovieDuration 
            && this._value === other._value;
    }

    public hasIntermission(): boolean {
        return this._value > 100;
    }

    public get intermissionDuration(): number {
        return MovieDuration._INTERMISSION_DURATION;
    }

    public get value(): number {
        return this._value;
    }
}