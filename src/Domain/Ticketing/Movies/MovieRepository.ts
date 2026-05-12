import { Repository } from '@/Domain/Shared/mod.ts';
import { Movie, MovieId } from '@/Domain/Ticketing/Movies/Movie.ts';


export interface MovieRepository extends Repository<Movie, MovieId>{
    
}