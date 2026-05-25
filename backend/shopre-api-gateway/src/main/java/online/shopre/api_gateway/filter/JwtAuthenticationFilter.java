package online.shopre.api_gateway.filter;

import online.shopre.api_gateway.service.JwtService;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService){
        this.jwtService = jwtService;
    }


    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();
        if(path.startsWith("/api/v1/auth") || path.startsWith("/api/v1/products")){
            return chain.filter(exchange);
        }

        String authorizationHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authorizationHeader.substring(7);
        if(!jwtService.ValidateToken(token)){
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // Add X-USER-ID when present in token (optional claim)
        String userId = jwtService.extractUserId(token);
        ServerWebExchange exchangeToUse = exchange;
        if (userId != null) {
            var mutatedRequest = exchange.getRequest()
                    .mutate()
                    .headers(httpHeaders -> {
                        httpHeaders.remove("X-USER-ID");
                        httpHeaders.add("X-USER-ID", userId);
                    })
                    .build();
            exchangeToUse = exchange.mutate().request(mutatedRequest).build();
        }

        return chain.filter(exchangeToUse);
//        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return 0;
    }
}

