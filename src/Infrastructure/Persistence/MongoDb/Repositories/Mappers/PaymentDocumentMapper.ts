import type { Document } from '@mongodb';
import {
    type DocumentMapper,
    serializeObjectToDocument,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { Payment } from '@/Domain/Ticketing/Payment/Payment.ts';
import {
    BookingId,
    CardNumber,
    CVV,
    ExpiryDate,
    ExternalId,
    OrderId,
    PaymentAmount,
    PaymentId,
    PaymentMethod,
    PaymentStatus,
} from '@/Domain/Ticketing/Payment/mod.ts';

export class PaymentDocumentMapper implements DocumentMapper<Payment> {
    toDocument(payment: Payment): Document {
        return serializeObjectToDocument({
            externalId: payment.externalId.toString(),
            paymentMethod: payment.paymentMethod.paymentMethodType,
            cardNumber: payment.cardNumber.cardNumber,
            expiryDate: {
                month: payment.expiryDate.expiryMonth,
                year: payment.expiryDate.expiryYear,
            },
            cvv: payment.cvv.cvv,
            orderId: payment.orderId.toString(),
            bookingId: payment.bookingId.toString(),
            amount: payment.amount.amount,
            status: payment.status._value,
        });
    }

    reconstitute(document: Document): Payment {
        const expiryDate = document.expiryDate as Document;
        const payment = Object.create(Payment.prototype);

        payment._id = PaymentId.create((document.id ?? document._id) as string);
        payment._externalId = ExternalId.create(document.externalId as string);
        payment._paymentMethod = PaymentMethod.fromString(document.paymentMethod as string);
        payment._cardNumber = CardNumber.create(document.cardNumber as string);
        payment._expiryDate = ExpiryDate.create(
            expiryDate.month as number,
            expiryDate.year as number,
        );
        payment._cvv = CVV.create(document.cvv as string);
        payment._orderId = OrderId.create(document.orderId as string);
        payment._bookingId = BookingId.create(document.bookingId as string);
        payment._amount = PaymentAmount.create(document.amount as number);
        payment._status = PaymentStatus.createFromString(document.status as string);
        payment._domainEvents = [];

        return payment;
    }
}
