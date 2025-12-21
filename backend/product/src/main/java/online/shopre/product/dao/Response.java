package online.shopre.product.dao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
//@AllArgsConstructor
@NoArgsConstructor
public class Response {
    String message;
    Object data;

    public Response(String message, Object data) {
        this.message = message;
        this.data = data;
    }
}
