package com.syncapi.dto.apispec;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class FieldDto {
    private String id;
    private String name;
    private String type;
    private boolean isRequired;
    private String description;
    private String location; // "HEADER", "QUERY_PARAM", "REQUEST_BODY", "RESPONSE_BODY"
    private List<FieldDto> children;
}
