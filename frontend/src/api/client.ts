import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Ngrok 경고창 우회
  },
  timeout: 5000,
});

// 요청 인터셉터: Access Token 추가
client.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 에러 발생 시 토큰 재발급 로직
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 에러 상태가 401(Unauthorized)이고, 이미 재시도한 적이 없는 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        // Refresh API 호출
        const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          refreshToken
        });
        
        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;
        
        // 새 토큰 저장
        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        // 원래 요청 헤더 갱신 후 재요청
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(originalRequest);
        
      } catch (refreshError) {
        // 재발급 실패 시 로그아웃 처리
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
