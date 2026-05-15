import { WebApiController } from '@/Infrastructure/WebApi/Shared/mod.ts';
import { UseCase } from '@/Application/Ports/mod.ts';
import { AddCustomerToOrderUseCaseInput } from '@/Application/Ticketing/Orders/mod.ts';
import { RouterContext } from '@oak/oak';


export class AddCustomerInformationToOrderController implements WebApiController {
    private readonly _useCase: UseCase<AddCustomerToOrderUseCaseInput, void>;

    public constructor(useCase: UseCase<AddCustomerToOrderUseCaseInput, void>) {
        this._useCase = useCase;
    }

    public async handle(ctx: RouterContext<string>): Promise<void> {

        const orderId = ctx.params.orderId;

        if (!orderId) {
            ctx.response.status = 400;
            ctx.response.body = { error: "Order Id is required" };
            return;
        }

        const body = await ctx.request.body.json().catch(() => ({}));
        const input = this.retrieveUseCaseInputFromBody(orderId, body);

        await this._useCase.execute(input);

        ctx.response.status = 201;
        ctx.response.headers.set('Location', `/api/orders/${orderId}`);
    }

    private retrieveUseCaseInputFromBody(orderId: string, body: Record<string, unknown>): AddCustomerToOrderUseCaseInput {
        return {
            orderId,
            salutation: body.salutation as string,
            firstName: body.firstName as string,
            lastName: body.lastName as string,
            email: body.email as string,
            aggreToTerms: body.aggreToTerms as boolean,
        };
    }
}