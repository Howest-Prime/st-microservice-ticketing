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
import {
    type DocumentMapper,
    serializeObjectToDocument,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';

export class MovieDocumentMapper implements DocumentMapper<Movie> {
    toDocument(movie: Movie): Document {
        return serializeObjectToDocument({
            _id: movie.id.toString(),
            externalId: movie.externalId,
            title: movie.title.value,
            duration: movie.duration.value,
            genres: movie.genres.map((g) => g.value),
            ageRating: movie.ageRating.Value,
            posterUrl: movie.posterUrl.value,
            priceAmount: movie.price.amount,
            priceCurrency: movie.price.currency,
        });
    }

    reconstitute(document: Document): Movie {
        return this.reconstituteFromDocument(
            (document.id ?? document._id) as string,
            document.externalId as string,
            document.title as string,
            document.duration as number,
            document.genres as string[],
            document.ageRating as MovieAgeRatingValue,
            document.posterUrl as string,
            document.priceAmount as number,
            document.priceCurrency as string,
        );
    }

    private reconstituteFromDocument(
        id: string,
        externalId: string,
        title: string,
        duration: number,
        genres: string[],
        ageRating: MovieAgeRatingValue,
        posterUrl: string,
        priceAmount: number,
        priceCurrency: string,
    ): Movie {
        const movie = Object.create(Movie.prototype);

        movie._id = MovieId.create(id);
        movie._externalId = externalId;
        movie._title = MovieTitle.create(title);
        movie._duration = MovieDuration.create(duration);
        movie._genres = genres.map((g) => MovieGenre.create(g));
        movie._ageRating = MovieAgeRating.create(ageRating);
        movie._posterUrl = MoviePosterUrl.create(posterUrl);
        movie._price = Money.create(priceAmount, priceCurrency);
        movie._domainEvents = [];

        return movie;
    }
}
