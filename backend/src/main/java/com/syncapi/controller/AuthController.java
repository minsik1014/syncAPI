package com.syncapi.controller;

import com.syncapi.config.JwtProvider;
import com.syncapi.dto.LoginRequest;
import com.syncapi.dto.TokenResponse;
import com.syncapi.model.User;
import com.syncapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    //회원가입
    @PostMapping("/signup")
    public User signup(@RequestBody User user){
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        // 비밀번호 암호화 후 저장
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    //로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        try {
            // 1. 인증 진행 (아이디/비밀번호 확인)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // 2. 인증 성공 시 토큰 발급
            String email = authentication.getName();
            String accessToken = jwtProvider.createAccessToken(email);
            String refreshToken = jwtProvider.createRefreshToken(email);

            // 3. 사용자 정보 조회
            User user = userRepository.findByEmail(email).orElseThrow();

            return ResponseEntity.ok(TokenResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .build());
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "아이디 또는 비밀번호가 일치하지 않습니다."));
        }
    }

    //토큰 재발급
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        if (refreshToken != null && jwtProvider.validateToken(refreshToken)) {
            String email = jwtProvider.getEmailFromToken(refreshToken);
            
            // 유효한 리프레시 토큰이면 새로운 액세스 토큰 발급
            String newAccessToken = jwtProvider.createAccessToken(email);
            return ResponseEntity.ok(TokenResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken)
                    .build());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Refresh Token");
    }
}
