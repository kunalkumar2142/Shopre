package online.shopre.product.service;

import jakarta.ws.rs.BadRequestException;
import online.shopre.product.model.Product;
import online.shopre.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.ls.LSInput;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product createProduct(Product product){
        return productRepository.save(product);
    }

    public List<Product> getProducts(){
        return productRepository.findAll();
    }

    public Product getProduct(UUID id){

//        Optional<Product> product = productRepository.findById(id);
//        if (product.isPresent()){
//            return product.get();
//        }
//        return null

        return productRepository.findById(id).orElse(null); //functional programming.
    }

    public Product getProductBySlug(String slug){
        return productRepository.findBySlug(slug).orElse(null); //functional programming.
    }

    public List<Product> getAllProductsByIds(List<UUID> productIds) {
        if(productIds.isEmpty()) {
            throw new BadRequestException("productids cannot be empty");
        }
        return productRepository.findAllById(productIds);
    }

}