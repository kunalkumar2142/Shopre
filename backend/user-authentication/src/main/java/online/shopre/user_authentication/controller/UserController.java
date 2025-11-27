package online.shopre.user_authentication.controller;

import online.shopre.user_authentication.model.User;
import online.shopre.user_authentication.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.SecureCacheResponse;
import java.util.Optional;


@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = this.userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }


    @GetMapping("/me")
    public ResponseEntity<User> findProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        if (user == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(user);
    }
//
//    @GetMapping("/{email}")
//    public ResponseEntity<User> findByEmail(@PathVariable String email) {
//        Optional<User> user = this.userService.findByEmail(email);
//        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
//    }



//    @GetMapping("/{email}")
//    public ResponseEntity<User> findByEmail(@PathVariable String email) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        User user = (User) authentication.getPrincipal();
//        if (!user.getEmail().equals(email){
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//        return ResponseEntity.ok(user);
//    }

}