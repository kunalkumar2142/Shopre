package online.shopre.order_and_cart_management.service;

import jakarta.ws.rs.BadRequestException;
import lombok.AllArgsConstructor;
import online.shopre.order_and_cart_management.dto.AddToCartRequest;
import online.shopre.order_and_cart_management.dto.AddToCartResponse;
import online.shopre.order_and_cart_management.model.Cart;
import online.shopre.order_and_cart_management.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CartService {

    final private CartRepository cartRepository;

    public AddToCartResponse addToCart(UUID userId, AddToCartRequest request){

        if(request.getQuantity() == null || request.getQuantity() <= 0){
            throw new BadRequestException("Quantity must be greater than 0");
        }

        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUserId(userId);
            return cartRepository.save(newCart);
        });

    }
}
