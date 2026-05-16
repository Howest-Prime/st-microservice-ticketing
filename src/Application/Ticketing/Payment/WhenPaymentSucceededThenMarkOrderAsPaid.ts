import type { Logger, Policy, UseCase } from '@/Application/Ports/mod.ts';
import type { MarkOrderAsPaidInput } from '@/Application/Ticketing/Orders/mod.ts';
import { PaymentSucceeeded } from '@/Domain/Ticketing/Payment/mod.ts';

export class WhenPaymentSucceededThenMarkOrderAsPaid
    implements Policy<PaymentSucceeeded> {
    constructor(
        private readonly _markOrderAsPaidUseCase: UseCase<MarkOrderAsPaidInput, void>,
        private readonly _logger: Logger,
    ) {}

    async handle(event: PaymentSucceeeded): Promise<void> {
        this._logger.debug('Handling PaymentSucceeded event — marking order as paid', {
            orderId: event.orderId,
            paymentId: event.paymentId,
        });

        await this._markOrderAsPaidUseCase.execute({ orderId: event.orderId });
    }
}
