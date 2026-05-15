import { Logger, UseCase } from '@/Application/Ports/mod.ts';
import { GetOrderByBookingIdData, GetOrderByBookingIdQuery } from '@/Application/Ports/Queries/mod.ts';

export interface GetOrderByBookingIdInput {
    bookingId: string
}

export type GetOrderByBookingIdOutput = GetOrderByBookingIdData;

export class GetOrderByBookingIdUseCase implements UseCase<GetOrderByBookingIdInput, GetOrderByBookingIdOutput> {

    public constructor(
        private readonly _query: GetOrderByBookingIdQuery,
        private readonly _logger: Logger
    ){}

    public async execute(input: GetOrderByBookingIdInput): Promise<GetOrderByBookingIdOutput> {
        this._logger.debug('Retrieving order with booking id',{ bookingId: input.bookingId })
        return (await this._query.fetch(input.bookingId)).getOrThrow();
    }
}