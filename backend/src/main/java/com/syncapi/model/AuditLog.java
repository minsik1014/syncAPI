package com.syncapi.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // 어느 프로젝트에서 일어난 일인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    // '누가' 그 행동을 했는지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 어떤 행동을 했는지 (예: CREATE_API_SPEC, UPDATE_FIELD, DELETE_FOLDER)
    @Column(nullable = false)
    private String actionType;

    // 변경된 대상의 식별자 (예: 변경된 apiSpecId)
    private String targetId;

    // 상세 내용 (변경 전 데이터 -> 변경 후 데이터 등 JSON 텍스트로 보관하기 좋음)
    @Column(columnDefinition = "TEXT")
    private String details;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
