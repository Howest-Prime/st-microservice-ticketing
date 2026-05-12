import { ValueObject } from '@/Domain/Shared/mod.ts';

export enum MovieAgeRatingValue {
    All = 0,
    Six = 6,
    Nine = 9,
    Twelve = 12,
    Fourteen = 14,
    Sixteen = 16,
    Eighteen = 18,
}

export class MovieAgeRating extends ValueObject {

    private readonly _value: MovieAgeRatingValue;

    private constructor(ageRating: MovieAgeRatingValue) {
        super();
        this._value = ageRating;
    }

    public static create(ageRating: MovieAgeRatingValue): MovieAgeRating {
        return new MovieAgeRating(ageRating);
    }

    public override equals(other: MovieAgeRating): boolean {
        if(!other) {
            return false;
        }
        return this._value === other._value;
    }



    
}