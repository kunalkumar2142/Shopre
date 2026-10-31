package online.shopre.order_and_cart_management.controller;

import lombok.AllArgsConstructor;
import online.shopre.order_and_cart_management.dto.OrderResponse;
import online.shopre.order_and_cart_management.dto.PlaceOrderRequest;
import online.shopre.order_and_cart_management.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@RequestHeader("X-USER-ID") UUID userId, @RequestBody PlaceOrderRequest placeOrderRequest){
        return ResponseEntity.ok(orderService.placeOrder(userId, placeOrderRequest));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(@RequestHeader("X-USER-ID") UUID userId){
        return ResponseEntity.ok(orderService.getOrders(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@RequestHeader("X-USER-ID") UUID userId, @PathVariable UUID id){
        return ResponseEntity.ok(orderService.getOrder(userId, id));
    }
}
