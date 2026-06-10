# SyncAPI - Frontend

SyncAPI의 프론트엔드 애플리케이션입니다. 
아름답고 모던한 UI를 제공하며, Vercel을 통해 글로벌 네트워크망(CDN)에 무중단 배포되어 운영됩니다.

## 기술 스택 (Tech Stack)

| 영역 | 기술/라이브러리 | 배지 (Badge) |
| :---: | :---: | :---: |
| **코어 (Core)** | React 18, Vite | <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/> <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E"/> |
| **언어 (Lang)** | TypeScript | <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/> |
| **스타일 (CSS)** | Tailwind CSS, Lucide | <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/> |
| **상태 관리** | Zustand | <img src="https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge"/> |
| **네트워크** | Axios | <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"/> |
| **배포 (Deploy)** | Vercel | <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/> |

## 주요 아키텍처 및 특징

1. **하이브리드 로그인 & 오프라인 게스트 모드**
   - 백엔드 서버(Ngrok)와 연결할 수 없는 상황(예: 로컬 서버 전원 Off)에서도 면접관이나 방문자가 언제든지 서비스를 체험할 수 있도록 **오프라인 Mock 엔진**을 탑재했습니다.
   - `guest@syncapi.com` 으로 로그인 시 Axios 통신을 차단하고 브라우저 내부 가짜 DB(`mockApi.ts`)를 사용하여 모든 기능을 끊김 없이 제공합니다.
   
2. **Ngrok 우회 통신**
   - 로컬 백엔드 서버가 무료 Ngrok 계정을 사용할 때 발생하는 HTML 경고 화면(Browser Warning)을 우회하기 위해 전역 Axios 인터셉터에 `ngrok-skip-browser-warning` 헤더를 탑재했습니다.

3. **고품질 사용자 경험 (UX/UI)**
   - 유리 질감(Glassmorphism), 부드러운 전환 애니메이션, 최신 다크 모드 스타일링을 적용하여 B2B SaaS 수준의 쾌적한 작업 환경을 제공합니다.

## 로컬 실행 방법

```bash
# 1. 패키지 설치
npm install

# 2. 환경 변수 설정
# .env 파일을 생성하고 VITE_API_URL을 지정하세요. (미지정시 localhost:8082 사용)
echo "VITE_API_URL=https://[당신의-ngrok-url].ngrok-free.dev" > .env

# 3. 로컬 개발 서버 실행
npm run dev
```

## 배포 (Deployment)

Github 리포지토리에 코드가 Push 되면 Vercel 인프라에서 자동으로 감지하여 빌드 및 배포(`npm run build`)를 수행합니다.
