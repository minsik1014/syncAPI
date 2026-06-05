package com.syncapi.controller;

import com.syncapi.dto.user.UserRequestDto;
import com.syncapi.dto.user.UserResponseDto;
import com.syncapi.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponseDto register(@RequestBody UserRequestDto request) {
        return userService.registerUser(request);
    }
}
