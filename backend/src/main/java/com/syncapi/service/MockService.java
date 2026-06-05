package com.syncapi.service;

import com.syncapi.model.ApiSpec;
import com.syncapi.model.Field;
import com.syncapi.repository.ApiSpecRepository;
import com.syncapi.repository.FieldRepository;
import net.datafaker.Faker;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true) // 지연 로딩(Lazy)된 자식 필드들을 가져오기 위해 필수
public class MockService {

    private final ApiSpecRepository apiSpecRepository;
    private final FieldRepository fieldRepository;
    private final Faker faker;

    public MockService(ApiSpecRepository apiSpecRepository, FieldRepository fieldRepository) {
        this.apiSpecRepository = apiSpecRepository;
        this.fieldRepository = fieldRepository;
        this.faker = new Faker(); // 가짜 데이터 생성기 초기화
    }

    // 모킹 엔진 핵심 로직: 필드 조립기
    public Map<String, Object> generateMockResponse(String apiSpecId) {
        // 1. API 명세 확인
        ApiSpec apiSpec = apiSpecRepository.findById(apiSpecId)
                .orElseThrow(() -> new IllegalArgumentException("API를 찾을 수 없습니다."));

        // 2. 해당 API의 RESPONSE_BODY에 속하는 필드들 가져오기
        List<Field> allFields = fieldRepository.findByApiSpecId(apiSpecId);
        
        // 부모가 없는 최상위 필드만 먼저 필터링
        List<Field> rootFields = allFields.stream()
                .filter(f -> "RESPONSE_BODY".equals(f.getLocation()))
                .filter(f -> f.getParentField() == null)
                .toList();

        // 3. 재귀적으로 JSON 합성 (Schema Synthesis)
        return buildJsonObject(rootFields);
    }

    // 객체를 파고들어가며 JSON을 조립하는 마법의 재귀 메서드
    private Map<String, Object> buildJsonObject(List<Field> fields) {
        Map<String, Object> result = new HashMap<>();

        for (Field field : fields) {
            String type = field.getType().toLowerCase();
            String name = field.getName().toLowerCase();

            if (type.equals("object")) {
                // 타입이 Object면 자식 필드들을 가져와서 재귀 호출 (무한히 파고들기 가능)
                result.put(field.getName(), buildJsonObject(field.getChildFields()));
            } else if (type.equals("array")) {
                // 배열이면 임의로 요소 2개를 만들어서 리스트로 반환
                result.put(field.getName(), List.of(
                        buildJsonObject(field.getChildFields()),
                        buildJsonObject(field.getChildFields())
                ));
            } else {
                // 일반 타입(String, Number 등)은 이름에 걸맞은 진짜 같은 가짜 데이터를 즉석 생성
                result.put(field.getName(), generateFakeData(type, name));
            }
        }
        return result;
    }

    // 이름(name)과 타입(type)을 분석해서 스마트하게 데이터를 생성하는 엔진
    private Object generateFakeData(String type, String name) {
        if (type.equals("number")) {
            if (name.contains("id")) return faker.number().numberBetween(1, 1000);
            if (name.contains("age")) return faker.number().numberBetween(10, 80);
            if (name.contains("price")) return faker.number().randomDouble(2, 100, 10000);
            return faker.number().numberBetween(0, 100);
        } else if (type.equals("boolean")) {
            return faker.bool().bool();
        } else {
            // String 타입 스마트 매칭
            if (name.contains("email")) return faker.internet().emailAddress();
            if (name.contains("name")) return faker.name().fullName();
            if (name.contains("phone")) return faker.phoneNumber().cellPhone();
            if (name.contains("address")) return faker.address().fullAddress();
            if (name.contains("url")) return faker.internet().url();
            
            // 매칭되는 이름이 없으면 그럴싸한 랜덤 단어 생성
            return faker.lorem().word();
        }
    }
}
