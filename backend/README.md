# SyncAPI - Backend

SyncAPI의 백엔드 애플리케이션입니다.
회원 가입, API 명세서 저장, 프로젝트 관리, 멤버 초대 등 서비스의 핵심 로직과 데이터베이스 연동을 담당합니다.

## 🛠 기술 스택 (Tech Stack)

- **Framework:** Spring Boot 3.x
- **Language:** Java 17
- **Database:** MySQL 8.0 (JPA/Hibernate)
- **Security:** Spring Security, JWT (JSON Web Token)
- **Build Tool:** Gradle

## ✨ 주요 아키텍처 및 특징

1. **글로벌 CORS 및 Preflight(OPTIONS) 처리**
   - Vercel과 같은 글로벌 클라우드에 배포된 프론트엔드와 문제없이 통신하기 위해 `SecurityConfig`에 `CorsConfigurationSource`를 주입하여 전역 CORS 정책을 수립했습니다.
   - Spring Security의 필터 체인 통과 전 `OPTIONS` 사전 요청을 완벽히 허용하도록 설계되었습니다.

2. **역방향 터널링 (Reverse Proxy) 아키텍처**
   - 개발자의 로컬 환경(Mac)에서 구동되며, **Ngrok**을 통해 외부망으로 노출됩니다.
   - 값비싼 AWS RDS 등의 클라우드 DB를 유지하지 않고도 언제든 로컬 환경의 MySQL 데이터를 사용하여 외부 Vercel 앱과 직접 연동할 수 있는 매우 경제적이고 혁신적인 개발 인프라입니다.

3. **JWT 기반의 Stateless 보안 구조**
   - 세션(Session)에 의존하지 않는 JWT(Access/Refresh) 기반 인증 방식을 채택하여 API 서버로서의 확장성과 무상태성(Stateless)을 보장합니다.

## 🚀 로컬 실행 방법

### 환경 변수 설정
실행 전 로컬 MySQL 데이터베이스를 준비하고, 아래 환경 변수를 IDE(IntelliJ 등)의 설정이나 시스템 변수로 등록해야 합니다.

```env
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_needs_to_be_long_enough
```

### 서버 실행 및 터널링

1. **데이터베이스 실행:** 로컬 MySQL 서버를 가동합니다.
2. **Spring Boot 가동:** `./gradlew bootRun` 또는 IDE를 통해 `SyncApiApplication`을 실행합니다. (기본 포트: 8082)
3. **Ngrok 터널 생성:**
   새 터미널 창을 열고 아래 명령어를 입력하여 로컬 8082 포트를 외부 인터넷으로 연결합니다.
   ```bash
   ngrok http 8082
   ```
4. Ngrok이 뱉어내는 URL(예: `https://abcd-1234.ngrok-free.dev`)을 프론트엔드의 `VITE_API_URL`에 복사하면 풀스택 통신이 시작됩니다!
