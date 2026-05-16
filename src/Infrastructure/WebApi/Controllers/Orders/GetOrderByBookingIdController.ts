import { RouterContext, WebApiController } from '@/Infrastructure/WebApi/Shared/mod.ts';
import {
    GetOrderByBookingIdInput,
    GetOrderByBookingIdOutput,
} from '@/Application/Ticketing/Orders/mod.ts';
import { UseCase } from '@/Application/Ports/mod.ts';

export class GetOrderByBookingIdController implements WebApiController {
    public constructor(
        private readonly _useCase: UseCase<GetOrderByBookingIdInput, GetOrderByBookingIdOutput>
    ) {}

    public async handle(ctx: RouterContext<string>): Promise<void> {
        const id = ctx.params.bookingId;

        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = { error: 'Invalid BookingId' };
            return;
        }

        const input: GetOrderByBookingIdInput = {
            bookingId: id,
        };
        const orderData = await this._useCase.execute(input);

        ctx.response.status = 200;
        ctx.response.body = orderData;
    }
}
