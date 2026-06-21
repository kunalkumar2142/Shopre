package online.shopre.product.controller;

import online.shopre.product.dao.Response;
import online.shopre.product.model.Product;
import online.shopre.product.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class ProductController {

    @Autowired
    private ProductService productService;

    // this needs to  be converted to be an admin API.
    @PostMapping("/admin/products")
    public Product createProduct(@RequestBody Product product){
        return productService.createProduct(product);
    }

    @GetMapping("/products")
    public ResponseEntity<Response> getProducts() {
        var products = productService.getProducts();
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Response("products not found", null));
        }
        return ResponseEntity.ok(new Response("products fetched successfully", products));
    }

    // http://localhost:8082/api/v1/products/slug/men-slim-fit-smart-formal-shirt
    @GetMapping("/products/slug/{slug}")
    public ResponseEntity<Response> getProductBySlug(@PathVariable String slug) {
        Product product = productService.getProductBySlug(slug);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Response("product not found", null));
        }
        return ResponseEntity.ok(new Response("product fetched successfully", product));
    }

    // http://localhost:8082/api/v1/products/ea1e7f2f-409d-4681-b3e9-d80fd3a7b042
    @GetMapping("/products/{id}")
    public ResponseEntity<Response> getProduct(@PathVariable UUID id) {
        Product product = productService.getProduct(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Response("product not found", null));
        }
        return ResponseEntity.ok(new Response("product fetched successfully", product));
    }

    @GetMapping("/products/bulk")
    public ResponseEntity<Response> getProductsByIds(@RequestBody List<UUID> productIds){
        List<Product> products = productService.getAllProductsByIds(productIds);
        return ResponseEntity.ok(new Response("Product fetched succesfully!!", products));
    }


//    @GetMapping("/products")
//    public List<Product> getProducts(){
//        return productService.getProducts();
//    }
//
//    // get by slug.
//    @GetMapping("/products/slug/{slug}")
//    public Product getProductBySlug(@PathVariable String slug){
//        return productService.getProductBySlug(slug);
//    }
//
//    // get by id.
//    @GetMapping("/products/{id}")
//    public ResponseEntity<Product> getProduct(@PathVariable UUID id){
//        Product product = productService.getProduct(id);
//
//        if(product == null){
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(product);
//    }


}