# SyncAPI

**🔗 라이브 데모 (Vercel 배포): [https://sync-api-theta.vercel.app/](https://sync-api-theta.vercel.app/)**
> *오프라인 게스트 모드를 통해 백엔드 서버(Mac)가 꺼져 있어도 전체 UI와 기능을 체험해 볼 수 있습니다.*

SyncAPI는 프론트엔드와 백엔드 개발자 간의 원활한 협업을 위한 **API 명세서 관리 및 Mock 서버 플랫폼**입니다.
복잡한 API 문서를 직관적으로 관리하고, 가상(Mock) 서버 기능을 통해 백엔드 개발이 완료되기 전에도 프론트엔드 개발이 가능하도록 지원합니다.

## 프로젝트 아키텍처

본 프로젝트는 완전히 분리된 **프론트엔드-백엔드 하이브리드 아키텍처**로 구성되어 있습니다.

| 분야 | 기술 스택 | 배포 및 인프라 |
| :---: | :---: | :---: |
| **Frontend** | <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/> <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E"/> <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/> | <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/> |
| **Backend** | <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white"/> <img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white"/> <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/> | Mac Local Server |
| **Network** | <img src="https://img.shields.io/badge/Ngrok-1F1E37?style=for-the-badge&logo=ngrok&logoColor=white"/> <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white"/> | Reverse Proxy Tunnel |

- **Frontend:** Vercel에 배포되어 전 세계 어디서든 24시간 접속 가능한 무중단 서비스
- **Backend:** Mac 로컬 환경의 Spring Boot 및 MySQL 서버 사용
- **Network Tunneling:** Ngrok 리버스 프록시를 통해 클라우드 프론트엔드와 로컬 백엔드를 안전하게 연결

> 이 구조를 통해 값비싼 클라우드 DB 호스팅 비용 없이, 필요할 때만 로컬 서버를 가동하여 완벽한 풀스택 서비스를 운영할 수 있습니다.

## 핵심 기능
- **직관적인 API 트리 관리:** 폴더 구조로 API 명세서를 깔끔하게 정리
- **실시간 Mock 서버:** 명세서를 작성하는 즉시 사용할 수 있는 가상 API 엔드포인트 제공
- **게스트 체험 모드 (Offline Mode):** 로컬 서버가 꺼져 있더라도, 언제든지 방문자가 Vercel을 통해 프론트엔드 자체 Mock 데이터베이스로 핵심 기능을 체험해 볼 수 있는 기능 탑재
- **팀원 관리 및 권한 설정:** 각 API와 폴더별로 접근 권한 및 수정 권한 분리

## 📂 저장소 구조
- `/frontend`: React 기반 프론트엔드 애플리케이션 (상세 내용은 [frontend/README.md](./frontend/README.md) 참고)
- `/backend`: Spring Boot 기반 백엔드 애플리케이션 (상세 내용은 [backend/README.md](./backend/README.md) 참고)

## 시작하기 (개발 가이드)

### 1. 백엔드 실행
1. `backend` 폴더로 이동합니다.
2. `application.properties`에 MySQL 환경변수(`DB_USERNAME`, `DB_PASSWORD`)를 설정합니다.
3. Spring Boot 애플리케이션을 실행합니다. (기본 포트: 8082)
4. Ngrok을 사용하여 8082 포트를 포워딩합니다.
   ```bash
   ngrok http 8082
   ```

### 2. 프론트엔드 실행
1. `frontend` 폴더로 이동합니다.
2. 패키지를 설치합니다: `npm install`
3. 환경 변수(`.env`)에 Ngrok URL을 설정합니다.
   ```env
   VITE_API_URL=https://[당신의-ngrok-url].ngrok-free.dev
   ```
4. 실행합니다: `npm run dev`

---
*Developed as a capstone/portfolio project.*
