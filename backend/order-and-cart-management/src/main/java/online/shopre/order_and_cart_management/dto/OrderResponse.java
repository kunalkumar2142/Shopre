package online.shopre.order_and_cart_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import online.shopre.order_and_cart_management.model.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {

    private UUID id;

    private String orderNumber;

    private UUID userId;

    private List<OrderItemResponse> items;

    private Double totalAmount;

    private OrderStatus status;

    private String shippingAddress;

    private String phone;

    private String paymentMethod;

    private LocalDateTime createdAt;
}
