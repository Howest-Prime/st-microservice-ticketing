import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import { PaymentRequest, PaymentService } from '@/Application/Ports/Gateways/mod.ts';
import { BookingId, CardNumber, CVV, ExpiryDate, ExternalId, OrderId, Payment, PaymentAmount, PaymentMethod } from '@/Domain/Ticketing/Payment/mod.ts';

export interface PayOrderUseCaseInput {
    externalId: string
    orderId: string;
    paymentMethod: string;
    cardNumber: string;
    expirationDate: Date;
    cvv: string;
    bookingId: string;
    amount: number;
}


export class PayOrderUseCase implements UseCase<PayOrderUseCaseInput, void> {

    public constructor(
        private readonly _uow: UnitOfWork,
        private readonly _paymentService: PaymentService,
        private readonly _logger: Logger
    ) {}

    public async execute(input: PayOrderUseCaseInput): Promise<void> {
        this._logger.debug(`Processing payment for order ${input.orderId} with amount ${input.amount}`);

        await this._uow.do<void>( async() => {

            const newPayment =  Payment.create(
                ExternalId.create(input.externalId),
                PaymentMethod.fromString(input.paymentMethod),
                CardNumber.create(input.cardNumber),
                ExpiryDate.createFromDate(input.expirationDate),
                CVV.create(input.cvv),
                OrderId.create(input.orderId),
                BookingId.create(input.bookingId),
                PaymentAmount.create(input.amount),
            );

            const paymentRequest: PaymentRequest = {
                amount: newPayment.amount.amount,
                cardNumber: newPayment.cardNumber.cardNumber,
                expiryDate:  newPayment.expiryDate.toString(),
                cvv: newPayment.cvv.cvv,
                paymentMethod: newPayment.paymentMethod.paymentMethodType
            };

            this._logger.debug(`Sending payment request for order ${input.orderId} with amount ${input.amount}`);
            const paymentResponse = await this._paymentService.pay(paymentRequest);

            newPayment.handlePayment(paymentResponse.success, paymentResponse.failureReason)

            this._uow.save(newPayment);
            this._logger.info(`Payment for order ${input.orderId} processed with status ${newPayment.status}`);
        });


    }
}   