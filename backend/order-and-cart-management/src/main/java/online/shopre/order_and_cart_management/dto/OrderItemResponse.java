package online.shopre.order_and_cart_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponse {

    private UUID productId;

    private String name;

    private String slug;

    private String image;

    private Double price;

    private Integer quantity;

    private Double subtotal;
}
