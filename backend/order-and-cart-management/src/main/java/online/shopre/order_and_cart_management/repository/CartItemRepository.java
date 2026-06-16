package online.shopre.order_and_cart_management.repository;

import online.shopre.order_and_cart_management.model.Cart;
import online.shopre.order_and_cart_management.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartItemRepository  extends JpaRepository<CartItem, UUID> {
    Optional<CartItem> findByCartAndProductId(Cart cart, UUID productId);
}
