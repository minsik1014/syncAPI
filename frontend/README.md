# SyncAPI - API Collaboration & Simulation Platform

SyncAPI는 프론트엔드와 백엔드 개발자의 병렬 개발 생산성을 극대화하기 위한 **설계 우선(Design-First) API 협업 플랫폼**입니다. 실제 백엔드가 구축되기 전, API 명세를 공동 설계하고 이를 기반으로 실시간 Mock 서버 시뮬레이션 및 클라이언트 코드를 자동 생성합니다.

---

## 🚀 프로젝트 비전 (Project Vision)

기존의 API 문서 도구(Swagger 등)가 '구현 후 문서화'에 집중했다면, SyncAPI는 **'설계 후 구현'**을 지향합니다. 
- **병렬 개발 보장**: 명세 확정 즉시 가동되는 Mock 엔진으로 프론트엔드 개발의 병목 현상 제거.
- **커뮤니케이션 비용 절감**: 시각적인 API 변동 이력(Audit Trail) 관리.
- **실무 생산성 직결**: 명세 기반의 Axios, React Query 연동 코드 즉시 제공.

---

## 🛠 기술 스택 (Tech Stack)

### Front-end
- **Framework**: React 18 (TypeScript)
- **Build Tool**: Vite
- **State Management**: Zustand (Centralized Data Store)
- **Styling**: Tailwind CSS, Framer Motion (Animations)
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **API Client**: Axios & TanStack Query (Real-server Integration Ready)

### Back-end (Implementation Plan)
- **Language/Framework**: Java Spring Boot 3.x
- **ORM**: Spring Data JPA
- **Database**: MySQL / PostgreSQL (Hierarchical Data Modeling)
- **Security**: Spring Security, JWT
- **Logic**: Spring AOP (Activity Logging), Java Faker (Dynamic Mocking)

---

## 📦 시스템 아키텍처 및 폴더 구조 (Architecture)

본 프로젝트는 **관심사 분리(SoC)**와 **기능 단위 모듈화(Feature-based Folder Structure)**를 원칙으로 설계되었습니다.

### 📂 프로젝트 루트 구조
- `src/`: 모든 소스 코드가 포함된 핵심 디렉토리.
- `guidelines/`: 프로젝트 코딩 컨벤션 및 협업 규칙 문서.
- `public/`: 정적 자산(이미지, 파비콘 등).
- `vite.config.ts`: Vite 빌드 및 개발 서버 설정.
- `tailwind.config.js`: 디자인 시스템 및 테마 설정.

### 📂 `src/app/` 상세 구조

| 폴더/파일 | 역할 및 책임 | 핵심 내용 |
| :--- | :--- | :--- |
| **`types/`** | **타입 정의 (TS)** | `api.ts`: 앱 전체에서 사용되는 핵심 인터페이스(Project, ApiItem 등) 정의. |
| **`constants/`** | **상수 및 초기 데이터** | `api.ts`: HTTP 메서드 목록, 필드 타입, 초기 더미 데이터 관리. |
| **`pages/`** | **독립적 화면 단위** | `DashboardPage`, `ApiEditorPage` 등 큰 화면 단위의 컴포넌트 관리. |
| **`store/`** | **중앙 데이터 창고** | `useStore.ts`: Zustand 상태 관리. 오직 데이터 변경 로직(Action)만 포함. |
| **`hooks/`** | **비즈니스 로직 (두뇌)** | UI와 Store를 연결하는 커스텀 훅. 복잡한 연산 담당. |
| **`components/`** | **재사용 UI 부품** | 각 화면(Page)을 구성하는 작은 단위의 부품들. |
| ∟ `api-editor/` | 에디터 전용 부품 | `SpecEditor`, `MockTester`, `EditorSidebar` 등. |
| ∟ `dashboard/` | 대시보드 전용 부품 | `StatsSummary`, `AnalyticsCharts`, `ProjectGrid` 등. |
| ∟ `ui/` | 공통 원자 부품 | 버튼, 입력창, 테이블 등 범용 컴포넌트. |
| **`utils/`** | **공용 도구 상자** | 파싱, 코드 생성, 클립보드 복사 등 범용 함수. |
| **`App.tsx`** | **메인 진입점** | 레이아웃 구축 및 `pages/` 컴포넌트 간 내비게이션 관리. |

---

## 🛠 주요 유틸리티 상세 (Utility Logic)

- **`codeGenerator.ts`**: API 명세를 `Template Literals`를 이용해 가공하여 실제 동작하는 JavaScript/TypeScript 코드로 변환합니다.
- **`jsonParser.ts`**: `JSON.parse`와 `Object.entries`를 활용하여 임의의 JSON 구조를 우리 시스템의 `Field[]` 스키마로 정규화합니다.
- **`exportUtils.ts`**: 내부 데이터 구조를 Postman 컬렉션(JSON) 규격으로 변환하여 파일 다운로드를 지원합니다.
- **`openapiParser.ts`**: Swagger(OpenAPI 3.0) 명세를 재귀적으로 탐색하여 폴더와 API 트리 구조를 복원합니다.

---

## ✨ 핵심 기능 (Core Features)

### 1. Workspace Analytics (Dashboard)
- 전체 프로젝트 규모(API 개수) 및 실시간 트래픽(Mock 요청 수) 시각화.
- 프로젝트별 활성도 지표 제공을 통한 관리 효율성 증대.

### 2. Dynamic API Spec Editor
- **Hierarchy Structure**: `Project > Folder > API Spec > Field`로 이어지는 계층적 구조 관리.
- **Method Badge System**: GET, POST, PUT, DELETE 등 HTTP 메서드를 직관적인 뱃지 UI로 제어.
- **Dynamic Fields**: Request/Response의 헤더, 파라미터, 바디 스키마를 실시간 편집.

### 3. Interactive Mock Engine
- **Schema Synthesis**: 정의된 필드 타입(String, Number, Boolean 등)을 분석하여 즉석에서 가짜 JSON 응답 합성.
- **Fault Simulation**: 네트워크 지연(Latency) 및 다양한 HTTP 에러 상태코드(401, 404, 500 등) 시뮬레이션 기능.

### 4. Code Generation & Interoperability
- **Auto Generator**: 명세 기반의 Axios 통신 함수 및 React Query 커스텀 훅 자동 생성.
- **Data Import**: 외부 JSON 데이터 및 Swagger(OpenAPI 3.0) 명세 자동 파싱 및 주입.
- **Postman Support**: 설계된 API 컬렉션을 Postman 규격으로 Export.

### 5. Collaboration History
- **Audit Trail**: API 명세의 생성, 수정, 삭제 이력을 타임라인 형태로 추적.
- **Diff Viewer**: 변경 전/후의 데이터 차이를 시각적으로 제공.

---

## 🧠 Backend Engineering Goals (Focus Points)

백엔드 과정에서는 단순 CRUD를 넘어선 **엔지니어링 중심의 시스템**을 구축합니다.

1. **Hierarchical Data Modeling**: 트리 구조의 명세 데이터를 RDB에 정규화하여 저장하고, N+1 문제를 해결하는 최적화된 조회 로직 구현.
2. **Runtime Schema Interpretation**: 저장된 메타데이터를 백엔드 런타임에 해석하여 동적으로 응답을 생성하는 'Mocking Engine' 개발.
3. **AOP based Audit System**: 비즈니스 로직과 분리된 횡단 관심사(Cross-cutting Concerns) 처리를 통해 투명한 변경 이력 자동 로깅 시스템 구축.
4. **Data Interoperability Engine**: 외부 규격(OpenAPI)과 내부 도메인 모델 간의 복잡한 직렬화/역직렬화 및 정규화 프로세스 구현.

---

## 📝 LLM Training Context (AI Guide)

이 프로젝트는 **계층적 데이터 관리 플랫폼**의 전형적인 사례입니다. 
- LLM은 `src/app/store/useStore.ts`의 인터페이스를 최우선으로 학습하여 데이터 구조를 파악해야 합니다.
- 로직의 흐름은 `src/app/hooks/` 내부의 함수들이 `store`의 액션을 어떻게 호출하고 UI로 반환하는지를 통해 이해할 수 있습니다.
- 모든 UI는 `src/app/components/`에서 기능 단위로 분할되어 있으므로, 컴포넌트 간의 Props 전달 관계를 통해 데이터 흐름을 추적할 수 있습니다.
