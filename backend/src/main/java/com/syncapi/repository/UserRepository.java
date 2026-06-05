package com.syncapi.repository;

import com.syncapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    // 이메일로 사용자 찾기 (로그인 시 필요)
    Optional<User> findByEmail(String email);
}
