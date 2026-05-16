import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import { OrderId, OrderRepository } from '@/Domain/Ticketing/Order/mod.ts';
import { OrderNotFoundException } from '@/Application/Ticketing/Orders/mod.ts';

export interface MarkOrderAsPaidInput {
  orderId: string;
}

export class MarkOrderAsPaidUseCase implements UseCase<MarkOrderAsPaidInput, void> {
    constructor(
        private readonly _uow: UnitOfWork,
        private readonly _logger: Logger,
    ) {}

    public async execute(input: MarkOrderAsPaidInput): Promise<void> {
        this._logger.info(`Marking order as paid.`, { orderId: input.orderId });
        
        await this._uow.do<void>(async () => {
            const orderId = OrderId.create(input.orderId);
        
            const order = (await this._uow.getRepository<OrderRepository>('Order')
                    .byId(orderId))
                    .orElseThrow(() => new OrderNotFoundException(orderId.value));

            order.pay();

            await this._uow.save(order);
            this._logger.info(`Order marked as paid successfully.`, { orderId: input.orderId });
        });
    }
}
    
