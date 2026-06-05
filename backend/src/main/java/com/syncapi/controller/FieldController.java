package com.syncapi.controller;

import com.syncapi.dto.field.FieldRequestDto;
import com.syncapi.dto.field.FieldResponseDto;
import com.syncapi.service.FieldService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fields")
public class FieldController {

    private final FieldService fieldService;

    public FieldController(FieldService fieldService) {
        this.fieldService = fieldService;
    }

    // GET /api/fields?apiSpecId=123 형식으로 특정 API의 응답 필드 목록 조회
    @GetMapping
    public List<FieldResponseDto> getFields(@RequestParam String apiSpecId) {
        return fieldService.getFieldsByApiSpecId(apiSpecId);
    }

    // POST /api/fields 형식으로 새 필드 등록
    @PostMapping
    public FieldResponseDto createField(@RequestBody FieldRequestDto requestDto) {
        return fieldService.createField(requestDto);
    }
}
