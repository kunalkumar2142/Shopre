package online.shopre.user_authentication.controller;

import online.shopre.user_authentication.dao.AuthResponse;
import online.shopre.user_authentication.dao.SignInRequest;
import online.shopre.user_authentication.dao.SignUpRequest;
import online.shopre.user_authentication.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody SignUpRequest signUpRequest) {
        return ResponseEntity.ok(authService.registerUser(signUpRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUse(@RequestBody SignInRequest signInRequest){
        return ResponseEntity.ok(authService.authenticate(signInRequest));
    }
}
