package online.shopre.user_authentication.service;

import online.shopre.user_authentication.model.User;
import online.shopre.user_authentication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findByEmail(String email){
        return this.userRepository.findByEmail(email);
    }
}
