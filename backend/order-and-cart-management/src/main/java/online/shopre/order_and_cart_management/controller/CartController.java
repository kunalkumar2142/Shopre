package online.shopre.order_and_cart_management.controller;

import lombok.AllArgsConstructor;
import online.shopre.order_and_cart_management.dto.AddToCartRequest;
import online.shopre.order_and_cart_management.dto.AddToCartResponse;
import online.shopre.order_and_cart_management.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cart")
@AllArgsConstructor  // also use @RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    public ResponseEntity<AddToCartResponse> addItemToCart(@RequestHeader("X-USER-ID") UUID userId, @RequestBody AddToCartRequest addToCartRequest){
        System.out.println("UserId " + userId + "/n" + "CartItemRequest" + addToCartRequest.toString());
        return ResponseEntity.ok(cartService.addToCart(userId, addToCartRequest));
    }
}
