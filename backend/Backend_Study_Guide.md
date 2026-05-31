# SyncAPI 백엔드 개발 및 학습 가이드 🚀

이 가이드는 백엔드 지식이 전혀 없는 상태에서, 프론트엔드와 연동되는 **Spring Boot 백엔드 애플리케이션**을 기초부터 한 땀 한 땀 공부하며 직접 구현해 나갈 수 있도록 돕기 위해 작성되었습니다.

---

## 1. 프로젝트 분석 (프론트엔드 분석 결과)

현재 프론트엔드 코드를 분석한 결과, 이 프로젝트는 **SyncAPI**라는 **"웹 기반 API 설계 및 Mock 서버 시뮬레이션 도구"**입니다. 

### 📌 주요 기능
1. **프로젝트 관리**: API 설계를 담을 컨테이너(프로젝트)를 생성, 조회, 수정, 삭제(CRUD)합니다.
2. **폴더 및 API 설계**: 프로젝트 내부에서 폴더 트리 구조를 만들고, 그 아래에 HTTP Method(GET, POST 등)와 Path를 지정하여 API 명세를 작성합니다.
3. **상세 명세(Params, Headers, Body)**: 요청과 응답 각각에 대해 어떤 필드가 들어가는지 속성(이름, 타입, 필수 여부, 설명)을 정의합니다.
4. **Mock API 시뮬레이터**: 백엔드가 없어도 가짜 응답 속도 지연(Latency)이나 강제 에러(400, 500 등)를 설정하여 작동을 테스트합니다.
5. **클라이언트 코드 생성**: 작성한 명세를 기반으로 Axios 코드 등을 자동 생성합니다.

### 📌 백엔드에서 다뤄야 할 데이터 모델 관계
데이터베이스 설계의 핵심이 되는 구조입니다. 아래 순서로 계층을 이룹니다.

- **Project (프로젝트)**: 최상위 개념
- **Folder (폴더)**: 프로젝트 내부에 존재하며, 여러 API를 묶어주는 폴더 (1 : N 관계)
- **ApiItem (API 상세 명세)**: 특정 폴더 하위에 존재하며 HTTP 메서드, 경로, Mock 설정 등을 포함 (1 : N 관계)
- **Field (필드)**: API의 Request/Response 내 headers, params, body 각각에 포함되는 상세 필드 정보 (1 : N 관계)

---

## 2. 초보자를 위한 백엔드 학습 로드맵 (5단계)

공부하면서 하나씩 직접 타이핑해볼 수 있도록 가장 쉬운 단계부터 점진적으로 진행합니다.

```
[1단계: 개발 환경 및 헬로 월드] -> [2단계: 메모리 기반 Project API] -> [3단계: JPA와 H2 DB 적용] -> [4단계: 폴더 및 API 관계 맺기] -> [5단계: 프론트엔드 연동]
```

### 1단계: 개발 환경 구축 & 첫 API 실행 (Hello World)
* **목표**: 내 컴퓨터에 자바 개발 환경을 세팅하고, 스프링 부트 프로젝트를 만들어 브라우저에 "Hello World"를 띄웁니다.
* **학습 키워드**: JDK 17, IntelliJ, Spring Initializr, `@RestController`, `@GetMapping`

### 2단계: 컨트롤러와 서비스의 이해 (메모리 기반 Project CRUD)
* **목표**: 실제 DB를 연결하기 전에, 자바 코드의 메모리(List)를 데이터베이스 삼아서 프로젝트 목록을 생성/조회/삭제하는 간단한 REST API를 만듭니다.
* **학습 키워드**: REST API, HTTP Method (GET/POST/DELETE), 3-Tier Layered Architecture (Controller - Service)

### 3단계: 진짜 데이터 저장하기 (Spring Data JPA + H2 Database)
* **목표**: 서버가 꺼져도 데이터가 유지되도록 관계형 데이터베이스와 연동합니다. 설정이 아주 간편한 인메모리 DB인 H2를 사용합니다.
* **학습 키워드**: ORM (Object-Relational Mapping), JPA, Entity, Repository, SQL

### 4단계: 객체 간 관계 모델링 (Project -> Folder -> API 구조)
* **목표**: JPA의 핵심 기능인 연관 관계 매핑(`@ManyToOne`, `@OneToMany`)을 학습하고, 프로젝트 안에 폴더와 API를 생성하고 조회하는 기능을 만듭니다.
* **학습 키워드**: 일대다(1:N) 관계, 외래 키(Foreign Key), DTO (Data Transfer Object)

### 5단계: 프론트엔드 연결 및 CORS 해결
* **목표**: 프론트엔드 코드(React)에서 내가 만든 백엔드 API를 실제로 호출해보고, 웹 개발에서 자주 만나는 CORS(Cross-Origin Resource Sharing) 에러를 설정으로 해결합니다.
* **학습 키워드**: CORS 설정, Axios 통신

---

## 3. [1단계] 지금 바로 시작하기: 개발 환경 설정 및 헬로 월드

가장 먼저 백엔드 개발의 첫걸음을 떼어 봅시다. 순서대로 따라오시면 됩니다.

### Step 1. JDK 17 설치
자바 프로그램을 실행하고 빌드하기 위한 개발 도구(JDK)를 설치해야 합니다. Mac 기준 Homebrew를 이용하면 편리합니다.
1. 터미널을 엽니다.
2. 아래 명령어를 실행하여 JDK 17을 설치합니다 (혹은 직접 웹에서 설치해도 됩니다).
   ```bash
   brew install openjdk@17
   ```
3. 설치 확인: 터미널에 `java -version`을 입력했을 때 자바 버전 17이 정상적으로 표시되는지 확인합니다.

### Step 2. IntelliJ IDEA Community 설치
전 세계 자바 개발자들이 가장 많이 쓰는 개발 도구(IDE)인 IntelliJ를 설치합니다. 무료 버전인 **Community Edition**으로도 백엔드 공부를 완벽히 할 수 있습니다.
* [JetBrains 홈페이지](https://www.jetbrains.com/ko-kr/idea/download/)에서 다운로드해 설치합니다.

### Step 3. Spring Boot 프로젝트 생성 (Spring Initializr)
스프링 프로젝트의 초기 뼈대를 만들어주는 사이트를 이용합니다.
1. [start.spring.io](https://start.spring.io)에 접속합니다.
2. 설정을 다음과 같이 선택합니다:
   - **Project**: Gradle - Groovy
   - **Language**: Java
   - **Spring Boot**: 3.x.x (Snapshot이나 M이 붙지 않은 안정 버전 선택)
   - **Group**: `com.syncapi`
   - **Artifact**: `backend`
   - **Name**: `backend`
   - **Package name**: `com.syncapi`
   - **Packaging**: Jar
   - **Java**: 17
3. 우측 **Dependencies** 버튼을 눌러 아래 두 라이브러리를 추가합니다:
   - **Spring Web**: 웹 API(REST API) 개발을 위해 필수적입니다.
   - **Lombok**: 자바의 번거로운 Getter, Setter 코드 작성을 줄여줍니다.
4. 하단의 **GENERATE** 버튼을 눌러 압축파일을 다운로드하고, 압축을 풉니다.
5. 압축을 푼 폴더 전체를 이 프로젝트의 백엔드 디렉토리 `/Users/simminsik/Desktop/project/backend/syncApi/backend` 아래에 복사해 넣습니다.
