import { AmqpController } from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import { UseCase } from '@/Application/Ports/mod.ts';
import { CreateOrderFromBookingInput } from '@/Application/Ticketing/Orders/mod.ts';


export interface CreateOrderFromBookingRequestBody {
    bookingId: string,
    movieId: string,
    room: string,
    showtime: Date,
    numberOfStandardVisitors: number,
    numberOfDiscountedVisitors: number,
    seats: number[]
}

export class CreateOrderFromBookingController implements AmqpController<CreateOrderFromBookingRequestBody> {
    
    public constructor(
        private readonly _useCase: UseCase<CreateOrderFromBookingInput, string>
    ) {}
    
    async handle(request: CreateOrderFromBookingRequestBody): Promise<void> {
        const input: CreateOrderFromBookingInput = {
            bookingId: request.bookingId,
            movieId: request.movieId,
            room: request.room,
            showtime: request.showtime,
            amountOfStandardVisitors: request.numberOfStandardVisitors,
            amountOfDiscountedVisitors: request.numberOfDiscountedVisitors,
            seats: request.seats,
        };
        await this._useCase.execute(input);
    }

}