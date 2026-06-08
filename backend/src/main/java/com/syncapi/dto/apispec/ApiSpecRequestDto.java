package com.syncapi.dto.apispec;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ApiSpecRequestDto {
    private String title;
    private String method; // GET, POST, 등
    private String endpoint; // /api/users
    private String description;
    
    private String projectId; // 필수 (어느 프로젝트 소속인지)
    private String folderId;  // 선택 (특정 폴더 안에 속할 경우에만 입력, 없으면 null)
    private String userId;    // Audit Log에 쓰일 유저 ID
    private String logDetails; // 프론트엔드에서 계산한 변경 내역 (텍스트/JSON)

    private RequestData request;
    private ResponseData response;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class RequestData {
        private java.util.List<FieldDto> headers;
        private java.util.List<FieldDto> queryParams;
        private java.util.List<FieldDto> body;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class ResponseData {
        private java.util.List<FieldDto> body;
    }
}
