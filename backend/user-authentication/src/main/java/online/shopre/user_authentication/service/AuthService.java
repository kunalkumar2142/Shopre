package online.shopre.user_authentication.service;

import online.shopre.user_authentication.dao.AuthResponse;
import online.shopre.user_authentication.dao.SignUpRequest;
import online.shopre.user_authentication.model.User;
import online.shopre.user_authentication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }
    public AuthResponse registerUser(SignUpRequest signUpRequest) {
        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .build();

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken);
    }

}
