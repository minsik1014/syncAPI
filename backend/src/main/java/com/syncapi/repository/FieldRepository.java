package com.syncapi.repository;

import com.syncapi.model.Field;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FieldRepository extends JpaRepository<Field, String> {
    // 특정 API 명세의 전체 필드 조회
    List<Field> findByApiSpecId(String apiSpecId);

    // N+1 문제 해결을 위한 Fetch Join 쿼리 작성 예정
}
