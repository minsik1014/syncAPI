package com.syncapi.service;

import com.syncapi.dto.field.FieldRequestDto;
import com.syncapi.dto.field.FieldResponseDto;
import com.syncapi.model.ApiSpec;
import com.syncapi.model.Field;
import com.syncapi.repository.ApiSpecRepository;
import com.syncapi.repository.FieldRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class FieldService {

    private final FieldRepository fieldRepository;
    private final ApiSpecRepository apiSpecRepository;

    public FieldService(FieldRepository fieldRepository, ApiSpecRepository apiSpecRepository) {
        this.fieldRepository = fieldRepository;
        this.apiSpecRepository = apiSpecRepository;
    }

    // 특정 API에 속한 모든 필드 조회
    public List<FieldResponseDto> getFieldsByApiSpecId(String apiSpecId) {
        return fieldRepository.findByApiSpecId(apiSpecId).stream()
                .map(FieldResponseDto::from)
                .collect(Collectors.toList());
    }

    // 새로운 필드 생성
    @Transactional
    public FieldResponseDto createField(FieldRequestDto requestDto) {
        // 1. API 명세가 진짜 있는지 검증
        ApiSpec apiSpec = apiSpecRepository.findById(requestDto.getApiSpecId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 API 명세입니다."));

        // 2. 부모 필드가 있는지 검증 (객체 타입 안의 필드일 경우)
        Field parentField = null;
        if (requestDto.getParentFieldId() != null) {
            parentField = fieldRepository.findById(requestDto.getParentFieldId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 부모 필드입니다."));
        }

        // 3. 필드 생성 및 연결 (자기 참조 구조)
        Field field = Field.builder()
                .name(requestDto.getName())
                .type(requestDto.getType())
                .isRequired(requestDto.isRequired())
                .location(requestDto.getLocation())
                .description(requestDto.getDescription())
                .apiSpec(apiSpec)
                .parentField(parentField)
                .build();

        // 4. DB 저장 후 응답 상자로 포장
        Field savedField = fieldRepository.save(field);
        return FieldResponseDto.from(savedField);
    }
}
