package online.shopre.order_and_cart_management.repository;

import online.shopre.order_and_cart_management.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    Optional<Cart> findByUserId(UUID userId); //SELECT * FROM user where userId = userId;
}
