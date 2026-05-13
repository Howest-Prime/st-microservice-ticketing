import { Repository } from '@/Domain/Shared/mod.ts';
import { Movie } from '@/Domain/Ticketing/Movies/mod.ts';
import { MovieId } from '@/Domain/Ticketing/Shared/mod.ts';


export interface MovieRepository extends Repository<Movie, MovieId>{
    
}