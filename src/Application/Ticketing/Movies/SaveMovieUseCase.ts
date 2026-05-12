import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import { Movie, MovieAgeRating, MovieDuration, MovieGenre, MoviePosterUrl, MovieTitle } from '@/Domain/Ticketing/Movies/mod.ts';

export interface SaveMovieUseCaseInput{
    movieExternalId: string
    movieTitle: string,
    movieDuration: number,
    movieGenres: string[],
    posterUrl: string,
    ageRating: number
}


export class SaveMovieUseCase implements UseCase<SaveMovieUseCaseInput, string>{
    public constructor(
        private readonly _unitOfWork: UnitOfWork,
        private readonly _logger: Logger,
    ) {}

    async execute(input: SaveMovieUseCaseInput): Promise<string> {
        this._logger.debug('Saving new movie', {input});
        
        const result = await this._unitOfWork.do<string>(async () => {
            
            const newMovie = Movie.create(
                input.movieExternalId,
                MovieTitle.create(input.movieTitle),
                MovieDuration.create( input.movieDuration),
                input.movieGenres.map(genre => MovieGenre.create(genre)),
                MovieAgeRating.create(input.ageRating),
                MoviePosterUrl.create( input.posterUrl)
            )

            await this._unitOfWork.save(newMovie)

            this._logger.info('Movie saved successfully', {
                movieId: newMovie.movieId,
            });

            return newMovie.movieId.toString();
        });

        return result;
    }

    
}