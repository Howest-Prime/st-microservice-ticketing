import { UUIDEntityId, AggregateRoot} from '@/Domain/Shared/mod.ts';
import {
    MovieTitle,
    MovieDuration,
    MovieGenre,
    MovieAgeRating,
    MoviePosterUrl,
 } from '@/Domain/Ticketing/Movies/mod.ts';
 import { Money } from '@/Domain/Ticketing/Shared/mod.ts';


export class MovieId extends UUIDEntityId{
    private constructor(id?: string){
        super(id);
    }

    public static create(id?: string){
        return new MovieId(id);
    } 
}

export class Movie extends AggregateRoot<MovieId>{
    private readonly _externalId: string;
    private _title: MovieTitle;
    private _duration: MovieDuration;
    private _genres: MovieGenre[];
    private _ageRating: MovieAgeRating;
    private _posterUrl: MoviePosterUrl
    private _price: Money

    private constructor(
        id: MovieId,
        externalId: string,
        title: MovieTitle,
        duration: MovieDuration,
        genres: MovieGenre[],
        ageRating: MovieAgeRating,
        posterUrl: MoviePosterUrl,
    
    ){
        super(id);
        this._externalId = externalId;
        this._title = title;
        this._duration = duration;
        this._genres = genres;
        this._ageRating = ageRating;
        this._posterUrl = posterUrl;
        this._price = Money.create(0, "EUR");
    }

    public static create(
        externalId: string,
        title: MovieTitle,
        duration: MovieDuration,
        genres: MovieGenre[],
        ageRating: MovieAgeRating,
        posterUrl: MoviePosterUrl,
    ): Movie {
        const newMovie =  new Movie(
            MovieId.create(), 
            externalId, 
            title, 
            duration, 
            genres, 
            ageRating, 
            posterUrl, 
            );
        newMovie.validate();
        return newMovie;
    }

    protected validate(){
        if(this.genres.length < 0){
          //  throw new InvalidMovieGenre()
        }
    }

    public get movieId(): MovieId {
        return this.id;
    }

    public get externalId(): string {
        return this._externalId;
    }

    public get title(): MovieTitle {
        return this._title;
    }

    public set title(title: MovieTitle) {
        this._title = title;
    }

    public get duration(): MovieDuration {
        return this._duration;
    }

    public set duration(duration: MovieDuration) {
        this._duration = duration;
    }

    public get genres(): MovieGenre[] {
        return [...this._genres];
    }

    public set genres(genres: MovieGenre[]) {
        this._genres = genres;
    }

    public get ageRating(): MovieAgeRating {
        return this._ageRating;
    }

    public set ageRating(ageRating: MovieAgeRating) {
        this._ageRating = ageRating;
    }

    public get posterUrl(): MoviePosterUrl {
        return this._posterUrl;
    }

    public set posterUrl(posterUrl: MoviePosterUrl) {
        this._posterUrl = posterUrl;
    }

    public get price(): Money {
        return this._price;
    }

    public set price(price: Money) {
        this._price = price;
    }
}