import { Field } from '../store/useStore';

/**
 * JSON 객체를 분석하여 SyncAPI의 Field 구조로 변환합니다.
 * @param jsonString 사용자가 입력한 JSON 문자열
 * @returns 변환된 Field 배열
 */
export const parseJsonToFields = (jsonString: string): Field[] => {
  try {
    const data = JSON.parse(jsonString);
    const fields: Field[] = [];

    // 재귀적으로 필드를 추출하는 내부 함수
    const extractFields = (obj: any, parentName: string = ''): void => {
      if (typeof obj !== 'object' || obj === null) return;

      Object.entries(obj).forEach(([key, value]) => {
        const type = Array.isArray(value) ? 'array' : typeof value;
        const fieldName = key;
        
        fields.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: fieldName,
          type: type === 'object' && value !== null ? 'object' : type,
          required: true, // 기본적으로 필수로 설정
          description: '', // 설명은 비워둠
        });

        // 만약 객체라면 내부도 파싱하고 싶을 수 있지만, 
        // 현재 SyncAPI의 Field 구조가 평면적이므로 일단 1단계만 처리하거나
        // 'user.name' 식으로 표현할 수 있습니다. 여기서는 1단계 처리를 우선으로 합니다.
      });
    };

    extractFields(data);
    return fields;
  } catch (error) {
    console.error('JSON Parsing Error:', error);
    throw new Error('유효하지 않은 JSON 형식입니다.');
  }
};
