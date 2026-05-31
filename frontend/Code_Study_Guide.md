# SyncAPI 프로젝트 코드 스터디 가이드 (상세판)

이 문서는 프로젝트의 핵심 기능부터 부가적인 유틸리티 기능까지, 코드로 어떻게 구현되었고 어떤 원리로 작동하는지 상세히 분석한 가이드입니다. 

---

## 1. 전역 상태 관리 및 데이터 흐름 (Zustand)

### 📌 핵심 파일: `src/app/store/useStore.ts`

**[작동 원리]**
React의 Props Drilling(데이터 내려주기) 문제를 해결하기 위해 `Zustand`를 사용하여 앱 전체에서 접근 가능한 "단일 데이터 창고(Store)"를 구성했습니다.

**[코드 상세 분석]**
```typescript
// 1. 상태의 '설계도(타입)'
interface SyncApiState {
  projects: Project[]; // 프로젝트 목록
  apiTrees: Record<string, FolderItem[]>; // 프로젝트 ID를 Key로 가지는 폴더/API 트리
  addApi: (projectId: string, folderId: string, api: ApiItem) => void;
}

// 2. 창고(Store) 생성 및 액션 정의
export const useStore = create<SyncApiState>((set) => ({
  projects: INITIAL_PROJECTS,
  apiTrees: INITIAL_API_TREES,

  // [핵심 로직] 불변성을 유지하며 깊은 깊이의 객체 수정하기
  updateApi: (projectId, apiId, updates) => set((state) => {
    const projectTree = state.apiTrees[projectId] || [];
    // map을 두 번 사용하여 (폴더 순회 -> 내부 API 순회) 타겟 API만 찾아내어 수정
    const updatedTree = projectTree.map(folder => ({
      ...folder,
      apis: folder.apis.map(api => api.id === apiId ? { ...api, ...updates } : api)
    }));
    return { apiTrees: { ...state.apiTrees, [projectId]: updatedTree } };
  }),
}));
```

---

## 2. 모의(Mock) 서버 시뮬레이션

### 📌 핵심 파일: `src/app/hooks/useApiEditor.ts` 내 `handleSendRequest`

**[작동 원리]**
백엔드 서버 없이도 프론트엔드가 테스트할 수 있도록, 지연 시간(Latency)과 에러 상태를 시뮬레이션하여 가짜 JSON 응답을 만들어냅니다.

**[코드 상세 분석]**
```typescript
const handleSendRequest = async () => {
  setIsLoading(true); // 버튼 상태를 로딩 중으로 변경
  
  // 1. 지연 시간(Latency) 시뮬레이션
  const delay = editingApi.mockConfig?.delay || 0;
  // Promise를 이용해 지정된 ms만큼 실행을 멈춤 (네트워크 지연 모방)
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // 2. 강제 에러 시뮬레이션
  const forcedError = editingApi.mockConfig?.forcedError;
  if (forcedError) {
    setResponseData(JSON.stringify({ status: forcedError, error: 'Error' }, null, 2));
  } else {
    // 3. 성공 응답 데이터 생성
    const mockRes: any = {};
    // API 명세(response.body)에 정의된 필드 타입을 기반으로 더미 데이터를 채움
    editingApi.response.body.forEach(f => {
      mockRes[f.name || 'key'] = f.type === 'number' ? 123 : f.type === 'boolean' ? true : `mock_${f.name}`;
    });
    // JSON.stringify의 3번째 인자(2)를 써서 예쁘게 들여쓰기된 JSON 문자열로 변환
    setResponseData(JSON.stringify(mockRes, null, 2));
  }
  setIsLoading(false);
};
```

---

## 3. 코드 자동 생성 (Code Generator)

### 📌 핵심 파일: `src/app/utils/codeGenerator.ts` & `CodeGenerator.tsx`

**[작동 원리]**
작성된 API 명세서 데이터를 읽어들여, 프론트엔드 개발자가 바로 복사해서 쓸 수 있는 `Axios`나 `React Query` 형식의 텍스트 코드로 변환해 줍니다. 템플릿 리터럴(백틱)을 적극 활용합니다.

**[코드 상세 분석 (Axios 생성 예시)]**
```typescript
export function generateAxiosCode(api: ApiItem): string {
  // 1. HTTP 메서드를 소문자로 변환 (GET -> get)
  const method = api.method.toLowerCase();
  
  // 2. Params나 Body 데이터가 있는지 확인하여 변수로 빼둘지 결정
  const hasParams = api.request.params.length > 0;
  const hasBody = api.request.body.length > 0;
  
  // 3. 템플릿 리터럴을 이용해 동적으로 코드를 조립
  return `import axios from 'axios';

// API 통신 함수
export const fetch${api.name.replace(/\s+/g, '')} = async (${hasBody ? 'data' : ''}) => {
  try {
    const response = await axios.${method}('${api.path}'${hasBody ? ', data' : ''}${hasParams ? ', { params }' : ''});
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};`;
}
```

---

## 4. 클립보드 복사 (Clipboard API)

### 📌 핵심 파일: `src/app/utils/clipboard.ts`

**[작동 원리]**
사용자가 '복사' 버튼을 눌렀을 때 텍스트를 클립보드에 저장합니다. 브라우저의 최신 표준인 `navigator.clipboard` API를 사용합니다.

**[코드 상세 분석]**
```typescript
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // navigator.clipboard API는 HTTPS나 로컬(localhost) 환경에서만 작동하는 최신 브라우저 기능입니다.
    await navigator.clipboard.writeText(text);
    return true; // 복사 성공
  } catch (err) {
    // 권한이 없거나 브라우저가 지원하지 않을 경우의 예외 처리
    console.error('클립보드 복사 실패:', err);
    return false; // 복사 실패
  }
};
```
* **교수님 설명 팁**: "예전에는 `document.execCommand('copy')`라는 편법을 썼지만, 보안과 안정성을 위해 최신 비동기 API인 `navigator.clipboard`를 적용했습니다."

---

## 5. JSON / Swagger 임포트 (데이터 파싱)

### 📌 핵심 파일: `src/app/utils/jsonParser.ts` & `openapiParser.ts`

**[작동 원리]**
사용자가 복사해서 붙여넣은 생짜 JSON 문자열이나 Swagger(OpenAPI) 명세서를 프로그램이 이해할 수 있는 상태(`Field[]` 배열 또는 `FolderItem[]`)로 변환합니다.

**[코드 상세 분석 (JSON 파싱 예시)]**
```typescript
export function parseJsonToFields(jsonString: string): Field[] {
  // 1. JSON.parse()로 문자열을 JavaScript 객체로 변환
  const parsed = JSON.parse(jsonString);
  const fields: Field[] = [];

  // 2. 객체의 Key와 Value를 순회하며 Field 구조체로 변환
  Object.entries(parsed).forEach(([key, value]) => {
    let type = typeof value; // 기본적으로 JavaScript의 typeof (string, number 등)를 사용
    
    if (Array.isArray(value)) type = 'array'; // 배열은 object로 나오기 때문에 예외 처리
    else if (value === null) type = 'string'; // null 처리
    
    // 3. 변환된 데이터를 우리 앱의 규격에 맞게 배열에 밀어 넣음
    fields.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // 고유 ID 난수 생성
      name: key,
      type: type,
      required: true,
      description: 'Imported field'
    });
  });

  return fields;
}
```

---

## 6. 검색 기능 (Real-time Filtering)

### 📌 핵심 파일: `src/app/components/api-editor/EditorSidebar.tsx`

**[작동 원리]**
사용자가 검색창에 타이핑할 때마다, 즉각적으로 목록이 줄어드는 기능입니다. 상태(State)가 변경될 때마다 화면이 새로 그려지는 React의 특징을 이용합니다.

**[코드 상세 분석]**
```tsx
// 검색어(searchQuery)가 바뀔 때마다 아래 코드가 다시 실행됨
{folder.apis
  .filter(api => 
    // 1. 대소문자 구분을 없애기 위해 모두 toLowerCase()로 변환 후 비교 (사용자 경험 향상)
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    api.path.toLowerCase().includes(searchQuery.toLowerCase()) // 이름뿐만 아니라 URL 경로로도 검색 가능하게 다중 조건 설정
  )
  .map(api => (
    // 2. 필터링을 통과한 데이터만 화면에 렌더링
    <button key={api.id}>{api.name}</button>
  ))
}
```

---

## 7. 향후 백엔드(Spring Boot) 연동 포인트

**교수님 질문 대비 모범 답안:**
> "현재는 프론트엔드 기능 완성에 집중하기 위해 `Zustand`와 더미 데이터를 사용했지만, 설계 단계부터 **백엔드 연동을 위한 확장성**을 고려했습니다.
> 
> 1. 실제 연동 시에는 `axios` 인스턴스를 만들어 공통 헤더(토큰 등)를 설정할 것입니다.
> 2. `useStore`의 로직 대신 `@tanstack/react-query`를 도입하여, `useMutation` 훅으로 Spring Boot의 API를 호출해 DB를 업데이트하고, 상태를 무효화(invalidate)하여 서버로부터 최신 데이터를 다시 불러오는 구조로 매끄럽게 전환할 계획입니다."
