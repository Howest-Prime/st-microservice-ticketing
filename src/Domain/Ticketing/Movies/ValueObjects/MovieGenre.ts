import { ValueObject } from '@/Domain/Shared/mod.ts';

import { InvalidMovieGenre } from '@/Domain/Ticketing/Movies/Mod.ts';


export class MovieGenre extends ValueObject {

    private static readonly _MIN_LENGTH: number = 2;

    private readonly _value: string;

    private constructor(genre: string){
        super();
        this._value = genre;
    }

    public static create(genre: string): MovieGenre {
        const newGenre = new MovieGenre(genre);
        newGenre.validate();
        return newGenre;
    }

    protected validate(): void {
        if(!this._value || this._value.trim().length < MovieGenre._MIN_LENGTH){
            throw new InvalidMovieGenre(this._value, MovieGenre._MIN_LENGTH);
        }
    }

    public override equals(other: ValueObject): boolean {
        return other instanceof MovieGenre 
            && this._value === other._value;
    }

    public get value(): string {
        return this._value;
    }
}