package com.syncapi.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "fields")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Field {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name; // 예: "email", "address"

    @Column(nullable = false)
    private String type; // 예: "String", "Object", "Array"

    private String description;
    
    @Builder.Default
    @Column(name = "is_required")
    private boolean isRequired = false;

    // 필드 소속 위치 구분 (HEADER, QUERY_PARAM, REQUEST_BODY, RESPONSE_BODY)
    @Column(name = "field_location", nullable = false)
    private String location; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "api_spec_id", nullable = false)
    private ApiSpec apiSpec;

    // 계층형 트리 구조 구현을 위한 자기 참조 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_field_id")
    private Field parentField;

    @OneToMany(mappedBy = "parentField", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Field> childFields = new ArrayList<>();

    // 연관관계 편의 메서드
    public void addChildField(Field child) {
        this.childFields.add(child);
        child.setParentField(this);
    }
}
