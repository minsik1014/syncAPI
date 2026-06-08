package com.syncapi.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "mock_api_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockApiLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String projectId;

    @Column(nullable = false)
    private String method;

    @Column(nullable = false)
    private String endpoint;

    @Column(nullable = false)
    private long latencyMs; // 응답에 걸린 시간(밀리초)

    @Column(nullable = false)
    private int statusCode; // 응답 상태 코드 (200, 404 등)

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
