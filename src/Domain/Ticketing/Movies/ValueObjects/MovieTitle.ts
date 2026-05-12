import { ValueObject } from '@/Domain/Shared/mod.ts';

import { InvalidMovieTitle } from '@/Domain/Ticketing/Movies/mod.ts';


export class MovieTitle extends ValueObject{
    private static readonly _MIN_REQUIRED_CHARACTERS: number = 3;
    private readonly _value: string;

    private constructor(title: string){
        super();
        this._value = title;
    }

    public static create(title: string): MovieTitle{
        const newMovieTitle = new MovieTitle(title);
        newMovieTitle.validate();
        return newMovieTitle;
    }

    protected validate(): void{
        if(!this._value || this._value.trim().length <= MovieTitle._MIN_REQUIRED_CHARACTERS){
            throw new InvalidMovieTitle(this._value, MovieTitle._MIN_REQUIRED_CHARACTERS);
        }
    }

    public override equals(other: ValueObject): boolean {
        return other instanceof MovieTitle 
            && this._value === other._value;
    }

    public get value(): string {
        return this._value;
    }
}