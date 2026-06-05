package com.syncapi.controller;

import com.syncapi.service.MockService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/mock")
public class MockController {

    private final MockService mockService;

    public MockController(MockService mockService) {
        this.mockService = mockService;
    }

    // 프론트엔드가 이 주소로 호출하면 백엔드에서 런타임에 즉석 JSON을 생성하여 반환함
    @GetMapping("/{apiSpecId}")
    public Map<String, Object> getMockData(@PathVariable String apiSpecId) {
        return mockService.generateMockResponse(apiSpecId);
    }
}
