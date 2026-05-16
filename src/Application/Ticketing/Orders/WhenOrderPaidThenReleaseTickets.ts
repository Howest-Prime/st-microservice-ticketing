import { Logger, Policy, UseCase } from '@/Application/Ports/mod.ts';
import { OrderPaid } from '@/Domain/Ticketing/Order/mod.ts';
import { ReleaseTicketInput } from '@/Application/Ticketing/Orders/ReleaseTicketUseCase.ts';

export class WhenOrderPaidThenReleaseTickets implements Policy<OrderPaid> {

    public constructor(
        private readonly _releaseTicketUseCase: UseCase<ReleaseTicketInput, void>,
        private readonly _logger: Logger,
    ) {}

    public async handle(event: OrderPaid): Promise<void> {
        this._logger.debug('Handling OrderPaid event — releasing tickets', {
            orderId: event.orderId,
        });
        await this._releaseTicketUseCase.execute({ orderId: event.orderId });
    }
} 