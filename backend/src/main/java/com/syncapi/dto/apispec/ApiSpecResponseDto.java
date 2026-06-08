package com.syncapi.dto.apispec;

import com.syncapi.model.ApiSpec;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiSpecResponseDto {
    private String id;
    private String title;
    private String method;
    private String endpoint;
    private String description;
    private String projectId;
    private String folderId;

    private ApiSpecRequestDto.RequestData request;
    private ApiSpecRequestDto.ResponseData response;

    // Entity -> DTO 변환
    public static ApiSpecResponseDto from(ApiSpec apiSpec) {
        ApiSpecRequestDto.RequestData requestData = new ApiSpecRequestDto.RequestData();
        ApiSpecRequestDto.ResponseData responseData = new ApiSpecRequestDto.ResponseData();
        
        requestData.setHeaders(new java.util.ArrayList<>());
        requestData.setQueryParams(new java.util.ArrayList<>());
        requestData.setBody(new java.util.ArrayList<>());
        responseData.setBody(new java.util.ArrayList<>());

        if (apiSpec.getFields() != null) {
            for (com.syncapi.model.Field field : apiSpec.getFields()) {
                if (field.getParentField() == null) { // 최상위 필드만 매핑
                    FieldDto dto = mapFieldToDto(field);
                    switch (field.getLocation()) {
                        case "HEADER": requestData.getHeaders().add(dto); break;
                        case "QUERY_PARAM": requestData.getQueryParams().add(dto); break;
                        case "REQUEST_BODY": requestData.getBody().add(dto); break;
                        case "RESPONSE_BODY": responseData.getBody().add(dto); break;
                    }
                }
            }
        }

        return ApiSpecResponseDto.builder()
                .id(apiSpec.getId())
                .title(apiSpec.getTitle())
                .method(apiSpec.getMethod())
                .endpoint(apiSpec.getEndpoint())
                .description(apiSpec.getDescription())
                .projectId(apiSpec.getProject().getId())
                .folderId(apiSpec.getFolder() != null ? apiSpec.getFolder().getId() : null)
                .request(requestData)
                .response(responseData)
                .build();
    }

    private static FieldDto mapFieldToDto(com.syncapi.model.Field field) {
        FieldDto dto = new FieldDto();
        dto.setId(field.getId());
        dto.setName(field.getName());
        dto.setType(field.getType());
        dto.setRequired(field.isRequired());
        dto.setDescription(field.getDescription());
        dto.setLocation(field.getLocation());
        
        if (field.getChildFields() != null && !field.getChildFields().isEmpty()) {
            java.util.List<FieldDto> children = new java.util.ArrayList<>();
            for (com.syncapi.model.Field child : field.getChildFields()) {
                children.add(mapFieldToDto(child));
            }
            dto.setChildren(children);
        }
        return dto;
    }
}
