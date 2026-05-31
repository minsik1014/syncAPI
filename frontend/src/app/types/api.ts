export interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ApiItem {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  isFavorite?: boolean;
  request: {
    params: Field[];
    headers: Field[];
    body: Field[];
    bodyRaw?: string;
  };
  response: {
    headers: Field[];
    body: Field[];
    bodyRaw?: string;
    statusCode: number;
  };
  mockConfig?: {
    delay: number;
    forcedError: number | null;
  };
}

export interface FolderItem {
  id: string;
  name: string;
  isExpanded: boolean;
  apis: ApiItem[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  apiCount: number;
  status: 'active' | 'inactive';
  lastUpdated: string;
  baseUrl?: string;
}

export interface ActivityEvent {
  id: string;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  action: '생성' | '수정' | '삭제';
  target: string;
  timestamp: string;
  timeAgo: string;
  changes?: { type: 'added' | 'removed' | 'unchanged'; content: string }[];
}
