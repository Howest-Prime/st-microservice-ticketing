import { AmqpController } from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import { UseCase } from '@/Application/Ports/mod.ts';
import { CreateOrderFromBookingInput } from '@/Application/Ticketing/Orders/mod.ts';
import { UUID } from '@domaincrafters/std';


export interface CreateOrderFromBookingRequest {
    bookingId: UUID;
    movieId: UUID;
    roomId: UUID;
    showTime: string;
    standardVisitors: number;
    discountVisitors: number;
    seatNumbers: number[];
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
            room: request.roomId.toString(),
            showtime: new Date(request.showTime),
            amountOfStandardVisitors: request.standardVisitors,
            amountOfDiscountedVisitors: request.discountVisitors,
            seats: request.seatNumbers,
        };
        await this._useCase.execute(input);
    }
}
