import { assertEquals, assertThrows } from '@std/assert';
import {
    CannotAcceptTermsException,
    CannotAddCustomerInfoException,
    CannotCancelOrderException,
    CannotPayOrderException,
    CannotReleaseTicketsException,
    Customer,
    CustomerEmail,
    CustomerSalutation,
    FirstName,
    LastName,
    Order,
    OrderId,
    OrderMustHaveAtLeastOneTicketException,
    OrderPaid,
    OrderStatus,
    OrderStatusState,
    Seat,
    TermsNotAcceptedException,
    Ticket,
    TicketsReleased,
    VisitorTypeLabel,
} from '@/Domain/Ticketing/Order/mod.ts';
import { MovieInfo } from '@/Domain/Ticketing/Order/ValueObjects/MovieInfo.ts';
import {
    MovieAgeRating,
    MovieDuration,
    MovieGenre,
    MovieId,
    MoviePosterUrl,
    MovieTitle,
} from '@/Domain/Ticketing/Shared/mod.ts';
import { MovieAgeRatingValue } from '@/Domain/Ticketing/Shared/ValueObjects/MovieAgeRating.ts';
import { OrderNotOpenForPaymentException } from '@/Domain/Ticketing/Order/Exceptions/OrderNotOpenForPaymentException.ts';

const makeMovieInfo = () =>
    MovieInfo.create(
        MovieId.create(),
        MovieTitle.create('Inception'),
        MovieDuration.create(120),
        [MovieGenre.create('Action')],
        MovieAgeRating.create(MovieAgeRatingValue.Twelve),
        MoviePosterUrl.create('https://example.com/inception.jpg'),
    );

const makeTicket = (seatNr = 1, type = VisitorTypeLabel.Standard) =>
    Ticket.create(makeMovieInfo(), Seat.create(seatNr, type), 'Room A', new Date('2026-12-01T20:00:00Z'));

const makeOrder = () => Order.create('ext-booking-001', [makeTicket()]);

const makeCustomer = () =>
    Customer.create(
        CustomerSalutation.create('Mr.'),
        FirstName.create('John'),
        LastName.create('Doe'),
        CustomerEmail.create('john.doe@example.com'),
    );

Deno.test('[Unit] - Order - create - valid input with one ticket - returns aggregate with correct properties', () => {
    // Act
    const order = makeOrder();

    // Assert
    assertEquals(order.id instanceof OrderId, true);
    assertEquals(order.externalBookingId, 'ext-booking-001');
    assertEquals(order.status.isOpen(), true);
    assertEquals(order.tickets.length, 1);
    assertEquals(order.customer, null);
    assertEquals(order.aggredToTerms, false);
});

Deno.test('[Unit] - Order - create - two tickets - calculates combined price', () => {
    // Arrange
    const tickets = [makeTicket(1), makeTicket(2)];

    // Act
    const order = Order.create('ext-booking-002', tickets);

    // Assert
    assertEquals(order.price.amount, 36); // 2 * (120 * 0.15)
    assertEquals(order.price.currency, 'EUR');
});

Deno.test('[Unit] - Order - create - empty tickets - throws OrderMustHaveAtLeastOneTicketException', () => {
    // Act & Assert
    assertThrows(
        () => Order.create('ext-booking-003', []),
        OrderMustHaveAtLeastOneTicketException,
    );
});

Deno.test('[Unit] - Order - create - two orders with same data - have different ids', () => {
    // Act
    const first = makeOrder();
    const second = makeOrder();

    // Assert
    assertEquals(first.id.equals(second.id), false);
});

Deno.test('[Unit] - Order - acceptTerms - open order - marks terms as accepted', () => {
    // Arrange
    const order = makeOrder();

    // Act
    order.acceptTerms();

    // Assert
    assertEquals(order.aggredToTerms, true);
    assertEquals(order.isTermsAccepted(), true);
});

Deno.test('[Unit] - Order - acceptTerms - non-open order - throws CannotAcceptTermsException', () => {
    // Arrange
    const order = makeOrder();
    order.cancel();

    // Act & Assert
    assertThrows(
        () => order.acceptTerms(),
        CannotAcceptTermsException,
    );
});

Deno.test('[Unit] - Order - acceptTermsIfAgreed - true - delegates to acceptTerms', () => {
    // Arrange
    const order = makeOrder();

    // Act
    order.acceptTermsIfAgreed(true);

    // Assert
    assertEquals(order.isTermsAccepted(), true);
});

Deno.test('[Unit] - Order - acceptTermsIfAgreed - false - does not accept terms', () => {
    // Arrange
    const order = makeOrder();

    // Act
    order.acceptTermsIfAgreed(false);

    // Assert
    assertEquals(order.isTermsAccepted(), false);
});

Deno.test('[Unit] - Order - addCustomerInfomations - open order with terms accepted - assigns customer', () => {
    // Arrange
    const order = makeOrder();
    order.acceptTerms();
    const customer = makeCustomer();

    // Act
    order.addCustomerInfomations(customer);

    // Assert
    assertEquals(order.isCustomerAssigned(), true);
    assertEquals(order.customer?.firstName.name, 'John');
});

Deno.test('[Unit] - Order - addCustomerInfomations - non-open order - throws CannotAddCustomerInfoException', () => {
    // Arrange
    const order = makeOrder();
    order.cancel();

    // Act & Assert
    assertThrows(
        () => order.addCustomerInfomations(makeCustomer()),
        CannotAddCustomerInfoException,
    );
});

Deno.test('[Unit] - Order - addCustomerInfomations - terms not accepted - throws TermsNotAcceptedException', () => {
    // Arrange
    const order = makeOrder();

    // Act & Assert
    assertThrows(
        () => order.addCustomerInfomations(makeCustomer()),
        TermsNotAcceptedException,
    );
});

Deno.test('[Unit] - Order - pay - open order with terms accepted - transitions to Paid status', () => {
    // Arrange
    const order = makeOrder();
    order.acceptTerms();

    // Act
    order.pay();

    // Assert
    assertEquals(order.status.isPaid(), true);
    assertEquals(order.status.status, OrderStatusState.Paid);
});

Deno.test('[Unit] - Order - pay - open order with terms accepted - raises OrderPaid event', () => {
    // Arrange
    const order = makeOrder();
    order.acceptTerms();

    // Act
    order.pay();
    const events = order.pullDomainEvents();

    // Assert
    assertEquals(events.length, 1);
    assertEquals(events[0] instanceof OrderPaid, true);
    const event = events[0] as OrderPaid;
    assertEquals(event.orderId, order.id.value);
    assertEquals(typeof event.bookingId, 'string');
    assertEquals(event.bookingId.length > 0, true);
    assertEquals(event.occurredOn instanceof Date, true);
});

Deno.test('[Unit] - Order - pay - non-open order - throws CannotPayOrderException', () => {
    // Arrange
    const order = makeOrder();
    order.cancel();

    // Act & Assert
    assertThrows(
        () => order.pay(),
        CannotPayOrderException,
    );
});

Deno.test('[Unit] - Order - pay - terms not accepted - throws TermsNotAcceptedException', () => {
    // Arrange
    const order = makeOrder();

    // Act & Assert
    assertThrows(
        () => order.pay(),
        TermsNotAcceptedException,
    );
});

Deno.test('[Unit] - Order - cancel - open order - transitions to Cancelled status', () => {
    // Arrange
    const order = makeOrder();

    // Act
    order.cancel();

    // Assert
    assertEquals(order.status.status, OrderStatusState.Cancelled);
    assertEquals(order.status.isOpen(), false);
});

Deno.test('[Unit] - Order - cancel - non-open order - throws CannotCancelOrderException', () => {
    // Arrange
    const order = makeOrder();
    order.cancel();

    // Act & Assert
    assertThrows(
        () => order.cancel(),
        CannotCancelOrderException,
    );
});

Deno.test('[Unit] - Order - releaseTickets - paid order - transitions to TicketReleased status', () => {
    // Arrange
    const order = makeOrder();
    order.acceptTerms();
    order.pay();
    order.pullDomainEvents(); // clear OrderPaid event

    // Act
    order.releaseTickets();

    // Assert
    assertEquals(order.status.status, OrderStatusState.TicketReleased);
});

Deno.test('[Unit] - Order - releaseTickets - paid order - raises TicketsReleased event', () => {
    // Arrange
    const order = makeOrder();
    order.acceptTerms();
    order.pay();
    order.pullDomainEvents(); // clear OrderPaid event

    // Act
    order.releaseTickets();
    const events = order.pullDomainEvents();

    // Assert
    assertEquals(events.length, 1);
    assertEquals(events[0] instanceof TicketsReleased, true);
    const event = events[0] as TicketsReleased;
    assertEquals(event.orderId, order.id.value);
    assertEquals(event.tickets.length, 1);
    assertEquals(event.occurredOn instanceof Date, true);
});

Deno.test('[Unit] - Order - releaseTickets - non-paid order - throws CannotReleaseTicketsException', () => {
    // Arrange
    const order = makeOrder();

    // Act & Assert
    assertThrows(
        () => order.releaseTickets(),
        CannotReleaseTicketsException,
    );
});

Deno.test('[Unit] - Order - ensureIsOpenForPayment - open order - does not throw', () => {
    // Arrange
    const order = makeOrder();

    // Act & Assert (should not throw)
    order.ensureIsOpenForPayment();
    assertEquals(order.status.isOpen(), true);
});

Deno.test('[Unit] - Order - ensureIsOpenForPayment - cancelled order - throws OrderNotOpenForPaymentException', () => {
    // Arrange
    const order = makeOrder();
    order.cancel();

    // Act & Assert
    assertThrows(
        () => order.ensureIsOpenForPayment(),
        OrderNotOpenForPaymentException,
    );
});

Deno.test('[Unit] - Order - status - open order - isStatusOpen returns true', () => {
    // Act
    const order = makeOrder();

    // Assert
    assertEquals(order.isStatusOpen(), true);
    assertEquals(order.isStatusPaid(), false);
});

Deno.test('[Unit] - Order - status - paid order - isStatusPaid returns true', () => {
    // Arrange
    const order = makeOrder();
    order.acceptTerms();
    order.pay();

    // Assert
    assertEquals(order.isStatusPaid(), true);
    assertEquals(order.isStatusOpen(), false);
});

Deno.test('[Unit] - Order - releaseTickets - with customer - includes customer in event', () => {
    // Arrange
    const order = makeOrder();
    order.acceptTerms();
    order.addCustomerInfomations(makeCustomer());
    order.pay();
    order.pullDomainEvents(); // clear OrderPaid event

    // Act
    order.releaseTickets();
    const events = order.pullDomainEvents();
    const event = events[0] as TicketsReleased;

    // Assert
    assertEquals(event.customer?.firstName, 'John');
    assertEquals(event.customer?.lastName, 'Doe');
    assertEquals(event.customer?.email, 'john.doe@example.com');
});

Deno.test('[Unit] - Order - status - static singletons - have correct states', () => {
    // Assert
    assertEquals(OrderStatus.Open.isOpen(), true);
    assertEquals(OrderStatus.Paid.isPaid(), true);
    assertEquals(OrderStatus.Cancelled.status, OrderStatusState.Cancelled);
    assertEquals(OrderStatus.TicketReleased.status, OrderStatusState.TicketReleased);
});

Deno.test('[Unit] - Order - create - duplicate seat numbers - throws InvalidTicketCountException', () => {
    // Arrange
    const ticket1 = makeTicket(1);
    const ticket2 = makeTicket(1); // same seat number

    // Act & Assert
    assertThrows(
        () => Order.create('ext-booking-dup', [ticket1, ticket2]),
        Error,
    );
});

Deno.test('[Unit] - Order - bookingId - returns a non-empty booking id', () => {
    // Arrange
    const order = makeOrder();

    // Assert
    assertEquals(typeof order.bookingId.value, 'string');
    assertEquals(order.bookingId.value.length > 0, true);
});
