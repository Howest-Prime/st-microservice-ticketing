import { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import { PaymentRequest, PaymentService } from '@/Application/Ports/Gateways/mod.ts';
import {
    BookingId,
    CardNumber,
    CVV,
    ExpiryDate,
    ExternalId,
    OrderId,
    Payment,
    PaymentAmount,
    PaymentMethod,
} from '@/Domain/Ticketing/Payment/mod.ts';
import { OrderRepository } from '@/Domain/Ticketing/Order/mod.ts';
import { OrderNotFoundException } from '@/Application/Ticketing/Orders/mod.ts';

export interface PayOrderInput {
    externalId: string;
    orderId: string;
    paymentMethod: string;
    cardNumber: string;
    expirationDate: Date;
    cvv: string;
    bookingId: string;
    amount: number;
}

export interface PayOrderOutput {
    paymentId: string;
}

export class PayOrderUseCase implements UseCase<PayOrderInput, PayOrderOutput> {
    public constructor(
        private readonly _uow: UnitOfWork,
        private readonly _paymentService: PaymentService,
        private readonly _logger: Logger
    ) {}

    public async execute(input: PayOrderInput): Promise<PayOrderOutput> {
        this._logger.debug('Processing payment', { orderId: input.orderId, amount: input.amount });

        const results = await this._uow.do<PayOrderOutput>(async () => {
            
            const orderId = OrderId.create(input.orderId);
            const order = (await this._uow.getRepository<OrderRepository>('Order')
                            .byId(orderId))
                            .orElseThrow(() => new OrderNotFoundException(orderId.value));
            
            order.ensureIsOpenForPayment();
            
            const payment = this.createPayment(input);

            const paymentRequest = this.createPaymentRequest(payment);

            this._logger.debug('Sending payment request', { orderId: payment.orderId, amount: payment.amount.amount });
            const paymentResponse = await this._paymentService.pay(paymentRequest);

            payment.handlePayment(paymentResponse.success, paymentResponse.failureReason);

            await this._uow.save(payment);
            this._logger.info('Payment processed', { orderId: payment.orderId, status: payment.status });

            return {
                paymentId: payment.id.toString(),
            };
        });

        return results;
    }

    private createPaymentRequest(payment: Payment): PaymentRequest {
        return {
            amount: payment.amount.amount,
            cardNumber: payment.cardNumber.cardNumber,
            expiryDate: payment.expiryDate.toString(),
            cvv: payment.cvv.cvv,
            paymentMethod: payment.paymentMethod.paymentMethodType,
        };
    }

    private createPayment(input: PayOrderInput): Payment {
        return Payment.create(
            ExternalId.create(input.externalId),
            PaymentMethod.fromString(input.paymentMethod),
            CardNumber.create(input.cardNumber),
            ExpiryDate.createFromDate(input.expirationDate),
            CVV.create(input.cvv),
            OrderId.create(input.orderId),
            BookingId.create(input.bookingId),
            PaymentAmount.create(input.amount),
        );
    }
}
