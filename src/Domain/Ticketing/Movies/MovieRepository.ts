import { Repository } from '@/Domain/Shared/mod.ts';
import { Movie } from '@/Domain/Ticketing/Movies/mod.ts';
import { MovieId } from '@/Domain/Ticketing/Shared/mod.ts';
import { Optional } from '@domaincrafters/std';

export interface MovieRepository extends Repository<Movie, MovieId> {
    byExternalId(externalId: string): Promise<Optional<Movie>>;
}
