import { ValueObject } from '@/Domain/Shared/mod.ts';
import {
    InvalidGenresException,
    Money,
    MovieAgeRating,
    MovieDuration,
    MovieGenre,
    MovieId,
    MoviePosterUrl,
    MovieTitle,
} from '@/Domain/Ticketing/Shared/mod.ts';

export class MovieInfo extends ValueObject {
    private static readonly PRICE_PER_MIN: number = 0.15;

    private readonly _id: MovieId;
    private readonly _title: MovieTitle;
    private readonly _duration: MovieDuration;
    private readonly _genres: MovieGenre[];
    private readonly _ageRating: MovieAgeRating;
    private readonly _posterUrl: MoviePosterUrl;
    private readonly _price: Money;

    private constructor(
        id: MovieId,
        title: MovieTitle,
        duration: MovieDuration,
        genres: MovieGenre[],
        ageRating: MovieAgeRating,
        posterUrl: MoviePosterUrl,
    ) {
        super();
        this._id = id;
        this._title = title;
        this._duration = duration;
        this._genres = genres;
        this._ageRating = ageRating;
        this._posterUrl = posterUrl;
        this._price = Money.create(MovieInfo.calculatePrice(duration.value), 'EUR');
    }

    public static create(
        id: MovieId,
        title: MovieTitle,
        duration: MovieDuration,
        genres: MovieGenre[],
        ageRating: MovieAgeRating,
        posterUrl: MoviePosterUrl,
    ): MovieInfo {
        const newMovie = new MovieInfo(
            id,
            title,
            duration,
            genres,
            ageRating,
            posterUrl,
        );
        newMovie.validate();
        return newMovie;
    }

    protected validate() {
        if (this.genres.length === 0) {
            throw new InvalidGenresException();
        }
    }

    override equals(other: MovieInfo): boolean {
        return this.Id.equals(other.Id);
    }

    private static calculatePrice(movieDuration: number): number {
        return movieDuration * MovieInfo.PRICE_PER_MIN;
    }

    public get Id(): MovieId {
        return this._id;
    }

    public get title(): MovieTitle {
        return this._title;
    }

    public get duration(): MovieDuration {
        return this._duration;
    }

    public get genres(): MovieGenre[] {
        return [...this._genres];
    }

    public get ageRating(): MovieAgeRating {
        return this._ageRating;
    }

    public get posterUrl(): MoviePosterUrl {
        return this._posterUrl;
    }

    public get price(): Money {
        return this._price;
    }
}
