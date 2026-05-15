import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import { Customer, CustomerEmail, CustomerSalutation, FirstName, LastName, OrderRepository } from '@/Domain/Ticketing/Order/mod.ts';
import { OrderNotFoundException } from '@/Application/Ticketing/Orders/mod.ts';


export interface AddCustomerToOrderUseCaseInput {
    orderId: string
    salutation: string,
    firstName: string,
    lastName: string,
    email: string,
    aggreToTerms: boolean
}

export class AddCustomerToOrderUseCase implements UseCase<AddCustomerToOrderUseCaseInput> {
    public constructor(
        private readonly _UoW: UnitOfWork,
        private readonly _logger: Logger
    ) {}

    async execute(input: AddCustomerToOrderUseCaseInput): Promise<void> {
        this._logger.debug('Adding customer info', {id: input.orderId});

        await this._UoW.do<void>(async () => {

            const order = (await this._UoW.getRepository<OrderRepository>('Order')
                            .byExternalId(input.orderId))
                            .orElseThrow(() => new OrderNotFoundException(input.orderId));
            
            order.acceptTermsIfAgreed(input.aggreToTerms);

            const customer = Customer.create(
                CustomerSalutation.create(input.salutation),
                FirstName.create(input.firstName),
                LastName.create(input.lastName),
                CustomerEmail.create(input.email),
            )

            order.addCustomerInfomations(customer);

            await this._UoW.save(order);

            this._logger.info('Added customer to an order', { orderId: input.orderId });

        });
    }

    
}


