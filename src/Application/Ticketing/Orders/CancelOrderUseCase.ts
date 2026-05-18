import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import { OrderRepository } from '@/Domain/Ticketing/Order/mod.ts';
import { OrderNotFoundException } from '@/Application/Ticketing/Orders/mod.ts';
import { OrderId } from '@/Domain/Ticketing/Payment/mod.ts';


export interface CancelOrderInput {
    orderId: string;
}

export class CancelOrderUseCase implements UseCase<CancelOrderInput, void> {
    public constructor(
        private readonly _uow: UnitOfWork,
        private readonly _logger: Logger
    ) {}

    public async execute(input: CancelOrderInput): Promise<void> {
        this._logger.debug(`Canceling order`, { orderId: input.orderId });

        await this._uow.do<void>(async () => {
            const orderId = OrderId.create(input.orderId);
            const order = (await this._uow.getRepository<OrderRepository>('Order').
                        byId(orderId)).
                        orElseThrow(() => new OrderNotFoundException(orderId.value));
        
            order.cancel();

            this._uow.save(order);
            this._logger.info(`Order cancelled`, { orderId: orderId.value });
        });
    
    }
}