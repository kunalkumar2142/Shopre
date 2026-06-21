package online.shopre.order_and_cart_management.client;

import online.shopre.order_and_cart_management.dto.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "shopre-product-service", url = "http://localhost:8082")
public interface ProductClient {

    @RequestMapping(method = RequestMethod.GET, value = "/products/bulk")
    List<Product> getProductByIds(List<UUID> productsIds);


}
