import { UseCase } from '@/Application/Ports/mod.ts';
import { PayOrderInput, PayOrderOutput } from '@/Application/Ticketing/Payment/mod.ts';
import { RouterContext, WebApiController } from '@/Infrastructure/WebApi/Shared/mod.ts';

export class PayAnOrderController implements WebApiController {
    public constructor(
        private readonly _payOrderUseCase: UseCase<PayOrderInput, PayOrderOutput>,
    ) {}

    public async handle(ctx: RouterContext<string>): Promise<void> {
        const orderId = ctx.params.orderId;

        if (!orderId) {
            ctx.response.status = 400;
            ctx.response.body = { error: 'Order Id is required' };
            return;
        }

        const body = await ctx.request.body.json().catch(() => ({}));
        const input = this.retrieveUseCaseInput(orderId, body);

        const result = await this._payOrderUseCase.execute(input);
        const paymentId = result.paymentId;

        ctx.response.status = 201;
        ctx.response.headers.set('Location', `/api/orders/${orderId}/payment/${paymentId}`);
        ctx.response.body = result;
    }

    private retrieveUseCaseInput(orderId: string, body: Record<string, unknown>): PayOrderInput {
        return {
            orderId,
            externalId: body.externalId as string,
            paymentMethod: body.paymentMethod as string,
            cardNumber: body.cardNumber as string,
            expirationDate: new Date(body.expirationDate as string),
            cvv: body.cvv as string,
            bookingId: body.bookingId as string,
            amount: body.amount as number,
        };
    }
}
