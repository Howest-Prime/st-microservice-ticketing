import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import { MovieInfo, Order, Seat, Ticket, VisitorTypeLabel } from '@/Domain/Ticketing/Order/mod.ts';
import { MovieRepository } from '@/Domain/Ticketing/Movies/mod.ts';
import { MovieNotFoundException } from '@/Application/Ticketing/Orders/Exceptions/MovieNotFoundException.ts';


export interface CreateOrderFromBookingInput {
    bookingId: string,
    movieId: string,
    room: string,
    showtime: Date,
    amountOfStandardVisitors: number,
    amountOfDiscountedVisitors: number,
    seats: number[]
}

export class CreateOrderFromBookingUseCase implements UseCase<CreateOrderFromBookingInput, string>{

    public constructor(
        private readonly _unitOfWork: UnitOfWork,
        private readonly _logger: Logger
    ) {}

    async execute(input: CreateOrderFromBookingInput): Promise<string> {

        const result = await this._unitOfWork.do<string>(async () => {
            this._logger.debug(`Creating order from booking`, {input});

            const movie = (await this._unitOfWork.getRepository<MovieRepository>('Movie')
                                .byExternalId(input.movieId))
                                .orElseThrow(() => new MovieNotFoundException(input.movieId));

            const movieInfo = MovieInfo.create(
                movie.movieId,
                movie.title,
                movie.duration,
                movie.genres,
                movie.ageRating,
                movie.posterUrl
            );

            const standardSeats = input.seats.slice(0, input.amountOfStandardVisitors);
            const discountedSeats = input.seats.slice(input.amountOfStandardVisitors);

            const tickets: Ticket[] = [
                ...standardSeats.map(seatNr =>
                    Ticket.create(movieInfo, Seat.create(seatNr, VisitorTypeLabel.Standard), input.room, input.showtime)
                ),
                ...discountedSeats.map(seatNr =>
                    Ticket.create(movieInfo, Seat.create(seatNr, VisitorTypeLabel.Discounted), input.room, input.showtime)
                ),
            ];

            const newOrder = Order.create(input.bookingId, tickets);

            await this._unitOfWork.save(newOrder);

            this._logger.info('Order created from booking', { orderId: newOrder.id.toString() });

            return newOrder.id.toString();
        });

        return result;
    }


}