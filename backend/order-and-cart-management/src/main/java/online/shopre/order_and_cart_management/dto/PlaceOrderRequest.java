package online.shopre.order_and_cart_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlaceOrderRequest {

    private String shippingAddress;

    private String phone;

    private String paymentMethod;
}
