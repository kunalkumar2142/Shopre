package online.shopre.order_and_cart_management.service;

import lombok.AllArgsConstructor;
import online.shopre.order_and_cart_management.client.ProductClient;
import online.shopre.order_and_cart_management.dto.OrderItemResponse;
import online.shopre.order_and_cart_management.dto.OrderResponse;
import online.shopre.order_and_cart_management.dto.PlaceOrderRequest;
import online.shopre.order_and_cart_management.dto.Product;
import online.shopre.order_and_cart_management.exception.BadRequestException;
import online.shopre.order_and_cart_management.model.Cart;
import online.shopre.order_and_cart_management.model.CartItem;
import online.shopre.order_and_cart_management.model.Order;
import online.shopre.order_and_cart_management.model.OrderItem;
import online.shopre.order_and_cart_management.model.OrderStatus;
import online.shopre.order_and_cart_management.repository.CartItemRepository;
import online.shopre.order_and_cart_management.repository.CartRepository;
import online.shopre.order_and_cart_management.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class OrderService {

    final private OrderRepository orderRepository;
    final private CartRepository cartRepository;
    final private CartItemRepository cartItemRepository;
    final private ProductClient productClient;

    @Transactional
    public OrderResponse placeOrder(UUID userId, PlaceOrderRequest request){

        if(request == null){
            throw new BadRequestException("Order request cannot be null!!");
        }
        if(request.getShippingAddress() == null || request.getShippingAddress().isBlank()){
            throw new BadRequestException("Shipping address is required!!");
        }
        if(request.getPhone() == null || request.getPhone().isBlank()){
            throw new BadRequestException("Phone number is required!!");
        }
        if(request.getPaymentMethod() == null || request.getPaymentMethod().isBlank()){
            throw new BadRequestException("Payment method is required!!");
        }

        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new  BadRequestException("cart not found for the user!!"));

        List<CartItem> cartItems = cartItemRepository.findAllByCartId(cart.getId());

        if(cartItems.isEmpty()){
            throw new BadRequestException("cart is empty!!");
        }

        List<UUID> productIds = cartItems.stream().map(CartItem :: getProductId).toList();
        List<Product> products = productClient.getProductByIds(productIds);

        Map<UUID, Product> productMap = new HashMap<>();
        for(Product product : products){
            productMap.put(product.getId(), product);
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setShippingAddress(request.getShippingAddress());
        order.setPhone(request.getPhone());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;
        for(CartItem cartItem : cartItems){
            Product product = productMap.get(cartItem.getProductId());
            if(product == null){
                throw new BadRequestException("product not found for id: " + cartItem.getProductId());
            }

            double subtotal = product.getPrice() * cartItem.getQuantity();
            totalAmount += subtotal;

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setProductSlug(product.getSlug());
            orderItem.setImage(getFirstImage(product));
            orderItem.setPrice(product.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSubtotal(subtotal);
            orderItems.add(orderItem);
        }
        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        cartItemRepository.deleteAll(cartItems);

        return buildOrderResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(UUID userId){
        List<Order> orders = orderRepository.findAllByUserId(userId);

        List<OrderResponse> orderResponses = new ArrayList<>();
        for(Order order : orders){
            orderResponses.add(buildOrderResponse(order));
        }
        return orderResponses;
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(UUID userId, UUID orderId){
        Order order = orderRepository.findByIdAndUserId(orderId, userId).orElseThrow(() -> new BadRequestException("order not found!!"));
        return buildOrderResponse(order);
    }

    private OrderResponse buildOrderResponse(Order order){
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        for(OrderItem orderItem : order.getItems()){
            OrderItemResponse itemResponse = new OrderItemResponse(
                    orderItem.getProductId(),
                    orderItem.getProductName(),
                    orderItem.getProductSlug(),
                    orderItem.getImage(),
                    orderItem.getPrice(),
                    orderItem.getQuantity(),
                    orderItem.getSubtotal()
            );
            itemResponses.add(itemResponse);
        }

        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setId(order.getId());
        orderResponse.setOrderNumber(order.getOrderNumber());
        orderResponse.setUserId(order.getUserId());
        orderResponse.setItems(itemResponses);
        orderResponse.setTotalAmount(order.getTotalAmount());
        orderResponse.setStatus(order.getStatus());
        orderResponse.setShippingAddress(order.getShippingAddress());
        orderResponse.setPhone(order.getPhone());
        orderResponse.setPaymentMethod(order.getPaymentMethod());
        orderResponse.setCreatedAt(order.getCreatedAt());

        return orderResponse;
    }

    private String getFirstImage(Product product){
        if(product.getImages() != null && product.getImages().length > 0){
            return product.getImages()[0];
        }
        return null;
    }
}
