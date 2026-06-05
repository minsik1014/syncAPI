package com.syncapi.service;

import com.syncapi.dto.user.UserRequestDto;
import com.syncapi.dto.user.UserResponseDto;
import com.syncapi.model.User;
import com.syncapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserResponseDto registerUser(UserRequestDto requestDto) {
        // 이메일 중복 체크
        if(userRepository.findByEmail(requestDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        User user = User.builder()
                .email(requestDto.getEmail())
                .name(requestDto.getName())
                .password(requestDto.getPassword())
                .build();

        return UserResponseDto.from(userRepository.save(user));
    }
}
