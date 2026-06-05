import axios from 'axios';

// 백엔드(Spring Boot) 서버와 통신하기 위한 기본 axios 인스턴스
const client = axios.create({
  baseURL: 'http://localhost:8082', // 우리가 띄운 백엔드 서버 주소
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5초 이상 응답 없으면 에러 처리
});

export default client;
