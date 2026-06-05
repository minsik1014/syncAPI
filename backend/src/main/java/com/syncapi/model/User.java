package com.syncapi.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String email; // 로그인 아이디 겸용

    @Column(nullable = false)
    private String name; // 사용자 이름

    private String password; // 비밀번호 (추후 암호화 예정)

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
