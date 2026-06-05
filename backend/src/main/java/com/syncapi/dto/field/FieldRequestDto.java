package com.syncapi.dto.field;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FieldRequestDto {
    private String name;         // 예: "email", "age"
    private String type;         // 예: "String", "Number", "Object"
    private boolean isRequired;  // 예: true, false
    private String location;     // 예: "REQUEST_BODY", "RESPONSE_BODY"
    private String description;  // 예: "사용자 이메일 주소"
    
    private String apiSpecId;    // 필수: 어느 API에 응답으로 나갈 필드인지
    private String parentFieldId; // 선택: 중첩 객체(Object)일 경우 부모 필드의 아이디
}
