import {
    MongoDbClient,
    MongoDbRepository,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { Movie, MovieRepository } from '@/Domain/Ticketing/Movies/mod.ts';
import { MovieDocumentMapper } from './Mappers/MovieDocumentMapper.ts';
import { MovieId } from '@/Domain/Ticketing/Shared/mod.ts';
import { Optional } from '@domaincrafters/std';
import { Document, Filter } from '@mongodb';

export class MongoDbMovieRepository extends MongoDbRepository<Movie, MovieId>
    implements MovieRepository {
    static override readonly collectionName: string = 'movies';

    constructor(
        client: MongoDbClient,
        mapper: MovieDocumentMapper
    ) {
        super(client, mapper, MongoDbMovieRepository.collectionName);
    }

    async byExternalId(externalId: string): Promise<Optional<Movie>> {
        if (!externalId?.trim()) {
            return Optional.empty<Movie>();
        }

        const document = await this._dbClient.findDocument(
            { externalId } as unknown as Filter<Document>,
            MongoDbMovieRepository.collectionName,
        );

        return document.map(
            this._documentMapper.reconstitute.bind(this._documentMapper),
        );
    }

    override get entityName(): string {
        return Movie.name;
    }
}
