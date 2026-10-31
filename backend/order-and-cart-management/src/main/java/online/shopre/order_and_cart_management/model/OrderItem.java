package online.shopre.order_and_cart_management.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(nullable = false)
    private UUID productId;

    private String productName;

    private String productSlug;

    private String image;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer quantity;

    private Double subtotal;
}
