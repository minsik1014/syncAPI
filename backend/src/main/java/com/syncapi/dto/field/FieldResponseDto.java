package com.syncapi.dto.field;

import com.syncapi.model.Field;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FieldResponseDto {
    private String id;
    private String name;
    private String type;
    private boolean isRequired;
    private String location;
    private String description;
    private String apiSpecId;
    private String parentFieldId;

    public static FieldResponseDto from(Field field) {
        return FieldResponseDto.builder()
                .id(field.getId())
                .name(field.getName())
                .type(field.getType())
                .isRequired(field.isRequired())
                .location(field.getLocation())
                .description(field.getDescription())
                .apiSpecId(field.getApiSpec().getId())
                // 자식 필드인 경우 부모 ID를 넣어주고, 최상단 필드면 null 반환
                .parentFieldId(field.getParentField() != null ? field.getParentField().getId() : null)
                .build();
    }
}
