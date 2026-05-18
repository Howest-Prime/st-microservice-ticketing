import { Logger, Policy, UseCase } from '@/Application/Ports/mod.ts';
import { PaymentFailed } from '@/Domain/Ticketing/Payment/mod.ts';
import { CancelOrderInput } from '@/Application/Ticketing/Orders/mod.ts';

export class WhenPaymentFailedThenCancelOrder implements Policy<PaymentFailed> {

    public constructor(
        private readonly _usecase: UseCase<CancelOrderInput, void>,
        private readonly _logger: Logger
    ) {};

    public async handle(event: PaymentFailed): Promise<void> {
        
        const orderId: CancelOrderInput = { orderId: event.orderId };
        await this._usecase.execute(orderId);
        this._logger.info(`Order cancelled`, { orderId: orderId });
    }
}