import { AmqpController } from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import { UseCase } from '@/Application/Ports/mod.ts';
import { CreateOrderFromBookingInput } from '@/Application/Ticketing/Orders/mod.ts';
import { UUID } from '@domaincrafters/std';


export interface CreateOrderFromBookingRequest {
    bookingId: UUID;
    movieId: UUID;
    room: string;
    showtime: string;
    numberOfStandardVisitors: number;
    numberOfDiscountedVisitors: number;
    seats: number[];
}

export class CreateOrderFromBookingController
    implements AmqpController<CreateOrderFromBookingRequest> {
    public constructor(
        private readonly _useCase: UseCase<CreateOrderFromBookingInput, string>
    ) {}

    async handle(request: CreateOrderFromBookingRequest): Promise<void> {
        const input: CreateOrderFromBookingInput = {
            bookingId: request.bookingId.toString(),
            movieId: request.movieId.toString(),
            room: request.room,
            showtime: new Date(request.showtime),
            amountOfStandardVisitors: request.numberOfStandardVisitors,
            amountOfDiscountedVisitors: request.numberOfDiscountedVisitors,
            seats: request.seats,
        };
        await this._useCase.execute(input);
    }
}
