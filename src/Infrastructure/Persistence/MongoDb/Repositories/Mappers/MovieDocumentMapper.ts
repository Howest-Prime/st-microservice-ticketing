import type { Document } from '@mongodb';

import { Movie, MovieId } from '@/Domain/Ticketing/Movies/Movie.ts';
import {
    MovieTitle,
    MovieDuration,
    MovieGenre,
    MovieAgeRating,
    MoviePosterUrl,
} from '@/Domain/Ticketing/Movies/mod.ts';
import { MovieAgeRatingValue } from '@/Domain/Ticketing/Movies/ValueObjects/MovieAgeRating.ts';
import { Money } from '@/Domain/Ticketing/Shared/mod.ts';
import { type DocumentMapper } from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';

interface MovieDocumentShape {
    _id?: string;
    id?: string;
    externalId: string;
    title: string;
    duration: number;
    genres: string[];
    ageRating: number;
    posterUrl: string;
    priceAmount: number;
    priceCurrency: string;
}

export class MovieDocumentMapper implements DocumentMapper<Movie> {
    toDocument(aggregate: Movie): Document {
        return {
            _id: aggregate.id.value,
            externalId: aggregate.externalId,
            title: aggregate.title.value,
            duration: aggregate.duration.value,
            genres: aggregate.genres.map((g) => g.value),
            ageRating: aggregate.ageRating['_value'] as number,
            posterUrl: aggregate.posterUrl.value,
            priceAmount: aggregate.price.amount,
            priceCurrency: aggregate.price.currency,
        };
    }

    reconstitute(document: Document): Movie {
        const snapshot = document as unknown as MovieDocumentShape;

        const movie = Object.create(Movie.prototype) as {
            _id: MovieId;
            _externalId: string;
            _title: MovieTitle;
            _duration: MovieDuration;
            _genres: MovieGenre[];
            _ageRating: MovieAgeRating;
            _posterUrl: MoviePosterUrl;
            _price: Money;
            _domainEvents: unknown[];
        };

        movie._id = MovieId.create((snapshot._id ?? snapshot.id) as string);
        movie._externalId = snapshot.externalId;
        movie._title = MovieTitle.create(snapshot.title);
        movie._duration = MovieDuration.create(snapshot.duration);
        movie._genres = snapshot.genres.map((g) => MovieGenre.create(g));
        movie._ageRating = MovieAgeRating.create(snapshot.ageRating as MovieAgeRatingValue);
        movie._posterUrl = MoviePosterUrl.create(snapshot.posterUrl);
        movie._price = Money.create(snapshot.priceAmount, snapshot.priceCurrency);
        movie._domainEvents = [];

        return movie as unknown as Movie;
    }
}
