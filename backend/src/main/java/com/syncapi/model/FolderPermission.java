package com.syncapi.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "folder_permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FolderPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // 권한을 부여할 대상 폴더 (도메인 폴더)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id", nullable = false)
    private Folder folder;

    // 권한을 받을 사용자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 폴더에 대한 개별 권한 (예: "EDITOR", "VIEWER")
    @Column(nullable = false)
    private String role;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime grantedAt;
}
