import { ValueObject } from '@/Domain/Shared/mod.ts';

import { InvalidPosterUrl } from '@/Domain/Ticketing/Movies/Mod.ts';

export class MoviePosterUrl extends ValueObject {

    private readonly _value: string;

    private constructor(url: string) {
        super();
        this._value = url;
    }

    public static create(posterUrl: string): MoviePosterUrl {
        const newPosterUrl = new MoviePosterUrl(posterUrl);
        newPosterUrl.validate();
        return newPosterUrl;
    }

    protected validate(): void {
        if(!this._value || !this.isValidUrl()){
            throw new InvalidPosterUrl(this._value);
        }
    }

    protected isValidUrl(): boolean {
        return this._value.startsWith('http://') || this._value.startsWith('https://');
    }

    public override equals(other: ValueObject): boolean {
        return other instanceof MoviePosterUrl 
            && this._value === other._value;
    }

    public get value(): string {
        return this._value;
    }
}