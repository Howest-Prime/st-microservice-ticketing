import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import { OrderId, OrderRepository } from '@/Domain/Ticketing/Order/mod.ts';
import { OrderNotFoundException } from '@/Application/Ticketing/Orders/mod.ts';

export interface ReleaseTicketInput {
    orderId: string;
}

export class ReleaseTicketUseCase implements UseCase<ReleaseTicketInput, void> {

    public constructor(
        private readonly _uow : UnitOfWork,
        private readonly _logger : Logger
    ) {}
    
    public async execute(input: ReleaseTicketInput): Promise<void> {
        this._logger.info(`Releasing ticket for order.`, { orderId: input.orderId });

        await this._uow.do<void>(async () => {

            const orderId = OrderId.create(input.orderId);
            const order = (await this._uow.getRepository<OrderRepository>('Order')
                    .byId(orderId))
                    .orElseThrow(() => new OrderNotFoundException(orderId.value));
            
            order.releaseTickets();

            await this._uow.save(order);
            this._logger.info(`Ticket released for order.`, { orderId: input.orderId });
        });

    }
}