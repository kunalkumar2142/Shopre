package online.shopre.order_and_cart_management.client;

import online.shopre.order_and_cart_management.dto.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "shopre-product-service", url = "http://localhost:8082/api/v1")
public interface ProductClient {

    @RequestMapping(method = RequestMethod.POST, value = "/products/bulk")
    List<Product> getProductByIds(@RequestBody List<UUID> productIds);

}
