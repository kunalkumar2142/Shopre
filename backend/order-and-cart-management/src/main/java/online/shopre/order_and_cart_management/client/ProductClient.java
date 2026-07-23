package online.shopre.order_and_cart_management.client;

import online.shopre.order_and_cart_management.dto.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "shopre-product-service", path = "/api/v1")
public interface ProductClient {
    @PostMapping("/products/bulk")
    List<Product> getProductByIds(@RequestBody List<UUID> productIds);
}
