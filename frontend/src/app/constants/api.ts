import { ApiItem, Project, FolderItem, ActivityEvent } from '../types/api';

export const HTTP_METHODS: ApiItem['method'][] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export const FIELD_TYPES = ['string', 'number', 'boolean', 'object', 'array'];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: '쇼핑몰 구축 API',
    description: '이커머스 플랫폼을 위한 상품, 주문, 결제 관련 RESTful API 명세',
    createdAt: '2026-03-15',
    apiCount: 24,
    status: 'active',
    lastUpdated: '2분 전',
    baseUrl: 'https://api.myshop.dev',
  },
  {
    id: '2',
    title: 'User Authentication Service',
    description: 'JWT 기반 사용자 인증 및 권한 관리 시스템 API',
    createdAt: '2026-04-02',
    apiCount: 12,
    status: 'active',
    lastUpdated: '1시간 전',
  },
];

export const INITIAL_API_TREES: Record<string, FolderItem[]> = {
  '1': [
    {
      id: 'f1',
      name: 'Auth',
      isExpanded: true,
      apis: [
        {
          id: 'a1',
          name: '로그인 API',
          method: 'POST',
          path: '/api/auth/login',
          description: '이메일과 비밀번호를 이용해 토큰을 발급받습니다.',
          request: {
            params: [],
            headers: [{ id: 'h1', name: 'Content-Type', type: 'string', required: true, description: 'application/json' }],
            body: [
              { id: 'b1', name: 'email', type: 'string', required: true, description: '사용자 이메일' },
              { id: 'b2', name: 'password', type: 'string', required: true, description: '비밀번호' }
            ],
          },
          response: {
            headers: [{ id: 'rh1', name: 'Content-Type', type: 'string', required: true, description: 'application/json' }],
            body: [
              { id: 'rb1', name: 'accessToken', type: 'string', required: true, description: 'JWT 토큰' },
              { id: 'rb2', name: 'user', type: 'object', required: true, description: '사용자 정보' }
            ],
            statusCode: 200,
          },
          mockConfig: { delay: 0, forcedError: null }
        }
      ]
    }
  ]
};

export const INITIAL_ACTIVITIES: Record<string, ActivityEvent[]> = {
  '1': [
    {
      id: 'act1',
      user: { name: '김개발', avatar: '', role: 'Backend Developer' },
      action: '수정',
      target: '로그인 API',
      timestamp: '2026-05-13 14:30',
      timeAgo: '2시간 전',
      changes: [
        { type: 'unchanged', content: '{' },
        { type: 'removed', content: '  "username": "string",' },
        { type: 'added', content: '  "email": "string",' },
        { type: 'unchanged', content: '}' },
      ]
    }
  ]
};
