package com.syncapi.controller;

import com.syncapi.model.ApiSpec;
import com.syncapi.model.Field;
import com.syncapi.model.MockApiLog;
import com.syncapi.repository.ApiSpecRepository;
import com.syncapi.repository.MockApiLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/mock")
@RequiredArgsConstructor
public class MockController {

    private final ApiSpecRepository apiSpecRepository;
    private final MockApiLogRepository mockApiLogRepository;

    @RequestMapping("/{projectId}/**")
    public ResponseEntity<Map<String, Object>> handleMockRequest(
            @PathVariable String projectId,
            HttpServletRequest request) {

        long startTime = System.currentTimeMillis();

        String method = request.getMethod();
        
        // 경로 추출 로직: /mock/{projectId}/api/v1/users -> /api/v1/users
        String pathWithinHandler = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String prefix = "/mock/" + projectId;
        String endpoint = pathWithinHandler;
        if (pathWithinHandler != null && pathWithinHandler.startsWith(prefix)) {
            endpoint = pathWithinHandler.substring(prefix.length());
        }
        
        if (endpoint == null || endpoint.isEmpty()) {
            endpoint = "/";
        }

        System.out.println("\n[Mock API 요청 수신!]");
        System.out.println(" - 프로젝트 ID: " + projectId);
        System.out.println(" - Method: " + method);
        System.out.println(" - Endpoint: " + endpoint);
        System.out.println("==============================\n");

        ApiSpec apiSpec = apiSpecRepository.findByProjectIdAndMethodAndEndpoint(projectId, method, endpoint);

        if (apiSpec == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Mock API Not Found");
            error.put("message", "해당 프로젝트(" + projectId + ")에 매칭되는 API 명세(" + method + " " + endpoint + ")가 없습니다.");
            
            // 실패 로그 저장
            long latency = System.currentTimeMillis() - startTime;
            mockApiLogRepository.save(MockApiLog.builder()
                    .projectId(projectId)
                    .method(method)
                    .endpoint(endpoint)
                    .latencyMs(latency)
                    .statusCode(404)
                    .build());
                    
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // Response Body 필드 추출
        List<Field> responseFields = apiSpec.getFields().stream()
                .filter(f -> "RESPONSE_BODY".equals(f.getLocation()))
                .collect(Collectors.toList());

        Map<String, Object> mockResponse = new HashMap<>();
        for (Field f : responseFields) {
            String type = f.getType().toLowerCase();
            String name = f.getName() != null && !f.getName().isEmpty() ? f.getName() : "key";
            
            if (type.contains("number") || type.contains("int")) {
                mockResponse.put(name, 123);
            } else if (type.contains("boolean") || type.contains("bool")) {
                mockResponse.put(name, true);
            } else {
                mockResponse.put(name, "mock_" + name);
            }
        }

        System.out.println(" - 동적 생성된 필드 목록:");
        mockResponse.forEach((k, v) -> System.out.println("    ▶ [" + k + "] : " + v));
        System.out.println("==============================\n");

        // X-Mock-Delay 헤더 처리 (강제 지연)
        String mockDelayStr = request.getHeader("X-Mock-Delay");
        long mockDelay = 0;
        if (mockDelayStr != null && !mockDelayStr.isEmpty()) {
            try { mockDelay = Long.parseLong(mockDelayStr); } catch (Exception e) {}
        }

        // 성공 로그 저장 및 지연 시뮬레이션
        long randomProcessingTime = mockDelay > 0 ? mockDelay : (long)(Math.random() * 40) + 10;
        try { Thread.sleep(randomProcessingTime); } catch (Exception e) {}
        
        long latency = System.currentTimeMillis() - startTime;
        
        // X-Mock-Error 헤더 처리 (강제 에러)
        String mockErrorStr = request.getHeader("X-Mock-Error");
        if (mockErrorStr != null && !mockErrorStr.isEmpty()) {
            try {
                int forcedStatusCode = Integer.parseInt(mockErrorStr);
                mockApiLogRepository.save(MockApiLog.builder()
                        .projectId(projectId)
                        .method(method)
                        .endpoint(endpoint)
                        .latencyMs(latency)
                        .statusCode(forcedStatusCode)
                        .build());
                Map<String, Object> errorResp = new HashMap<>();
                errorResp.put("status", forcedStatusCode);
                errorResp.put("error", "Forced Error");
                errorResp.put("message", "강제 " + forcedStatusCode + " 에러입니다.");
                return ResponseEntity.status(forcedStatusCode).body(errorResp);
            } catch (Exception e) {}
        }

        mockApiLogRepository.save(MockApiLog.builder()
                .projectId(projectId)
                .method(method)
                .endpoint(endpoint)
                .latencyMs(latency)
                .statusCode(200)
                .build());

        return ResponseEntity.ok(mockResponse);
    }
}
