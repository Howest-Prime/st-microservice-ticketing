import { assertEquals, assertThrows } from '@std/assert';
import {
    InvalidOrderStatusTransition,
    OrderStatus,
    OrderStatusState,
} from '@/Domain/Ticketing/Order/mod.ts';

Deno.test('[Unit] - OrderStatus - create - Open status - returns value object with correct state', () => {
    // Act
    const status = OrderStatus.create(OrderStatusState.Open);

    // Assert
    assertEquals(status.status, OrderStatusState.Open);
    assertEquals(status.isOpen(), true);
    assertEquals(status.isPaid(), false);
});

Deno.test('[Unit] - OrderStatus - create - Paid status - returns value object with correct state', () => {
    // Act
    const status = OrderStatus.create(OrderStatusState.Paid);

    // Assert
    assertEquals(status.status, OrderStatusState.Paid);
    assertEquals(status.isPaid(), true);
    assertEquals(status.isOpen(), false);
});

Deno.test('[Unit] - OrderStatus - transitionTo - Open to Paid - returns Paid status', () => {
    // Arrange
    const open = OrderStatus.Open;

    // Act
    const result = open.transitionTo(OrderStatus.Paid);

    // Assert
    assertEquals(result.isPaid(), true);
});

Deno.test('[Unit] - OrderStatus - transitionTo - Open to Cancelled - returns Cancelled status', () => {
    // Arrange
    const open = OrderStatus.Open;

    // Act
    const result = open.transitionTo(OrderStatus.Cancelled);

    // Assert
    assertEquals(result.status, OrderStatusState.Cancelled);
});

Deno.test('[Unit] - OrderStatus - transitionTo - Paid to TicketReleased - returns TicketReleased status', () => {
    // Arrange
    const paid = OrderStatus.Paid;

    // Act
    const result = paid.transitionTo(OrderStatus.TicketReleased);

    // Assert
    assertEquals(result.status, OrderStatusState.TicketReleased);
});

Deno.test('[Unit] - OrderStatus - transitionTo - Open to TicketReleased - throws InvalidOrderStatusTransition', () => {
    // Arrange
    const open = OrderStatus.Open;

    // Act & Assert
    assertThrows(
        () => open.transitionTo(OrderStatus.TicketReleased),
        InvalidOrderStatusTransition,
    );
});

Deno.test('[Unit] - OrderStatus - transitionTo - Paid to Cancelled - throws InvalidOrderStatusTransition', () => {
    // Arrange
    const paid = OrderStatus.Paid;

    // Act & Assert
    assertThrows(
        () => paid.transitionTo(OrderStatus.Cancelled),
        InvalidOrderStatusTransition,
    );
});

Deno.test('[Unit] - OrderStatus - transitionTo - TicketReleased to any - throws InvalidOrderStatusTransition', () => {
    // Arrange
    const released = OrderStatus.TicketReleased;

    // Act & Assert
    assertThrows(
        () => released.transitionTo(OrderStatus.Paid),
        InvalidOrderStatusTransition,
    );
});

Deno.test('[Unit] - OrderStatus - transitionTo - Cancelled to any - throws InvalidOrderStatusTransition', () => {
    // Arrange
    const cancelled = OrderStatus.Cancelled;

    // Act & Assert
    assertThrows(
        () => cancelled.transitionTo(OrderStatus.Open),
        InvalidOrderStatusTransition,
    );
});

Deno.test('[Unit] - OrderStatus - transitionTo - same status - throws InvalidOrderStatusTransition', () => {
    // Arrange
    const open = OrderStatus.Open;

    // Act & Assert
    assertThrows(
        () => open.transitionTo(OrderStatus.Open),
        InvalidOrderStatusTransition,
    );
});

Deno.test('[Unit] - OrderStatus - equals - same state - returns true', () => {
    // Arrange
    const left = OrderStatus.create(OrderStatusState.Open);
    const right = OrderStatus.create(OrderStatusState.Open);

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, true);
});

Deno.test('[Unit] - OrderStatus - equals - different states - returns false', () => {
    // Arrange
    const left = OrderStatus.Open;
    const right = OrderStatus.Paid;

    // Act
    const result = left.equals(right);

    // Assert
    assertEquals(result, false);
});

Deno.test('[Unit] - OrderStatus - equals - non OrderStatus value - returns false', () => {
    // Arrange
    const status = OrderStatus.Open;

    // Act
    const result = status.equals({} as unknown as OrderStatus);

    // Assert
    assertEquals(result, false);
});
