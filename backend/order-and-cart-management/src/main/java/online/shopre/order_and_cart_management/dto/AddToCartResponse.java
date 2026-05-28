package online.shopre.order_and_cart_management.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class AddToCartResponse {

    private String message;

    private UUID cartId;
}
