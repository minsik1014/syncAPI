import { ApiItem, FolderItem, Field } from '../store/useStore';

/**
 * OpenAPI 3.0 JSON 데이터를 SyncAPI 구조로 변환합니다.
 */
export const parseOpenApi = (jsonString: string): FolderItem[] => {
  try {
    const spec = JSON.parse(jsonString);
    const folders: Record<string, FolderItem> = {};
    const defaultFolderName = 'Imported APIs';

    // 1. Paths 순회
    Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
      Object.entries(methods).forEach(([method, detail]: [string, any]) => {
        if (!['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) return;

        // 태그를 기준으로 폴더 결정 (첫 번째 태그 사용)
        const tag = detail.tags && detail.tags.length > 0 ? detail.tags[0] : defaultFolderName;
        
        if (!folders[tag]) {
          folders[tag] = {
            id: `f-${Date.now()}-${tag}`,
            name: tag,
            isExpanded: true,
            apis: []
          };
        }

        // 2. 파라미터 추출 (Query, Path, Header)
        const params: Field[] = [];
        const headers: Field[] = [];
        
        if (detail.parameters) {
          detail.parameters.forEach((p: any) => {
            const field: Field = {
              id: `p-${Math.random()}`,
              name: p.name,
              type: p.schema?.type || 'string',
              required: p.required || false,
              description: p.description || ''
            };
            
            if (p.in === 'header') headers.push(field);
            else params.push(field); // query, path 통합 관리
          });
        }

        // 3. Request Body 추출
        const requestBodyFields: Field[] = [];
        const bodyContent = detail.requestBody?.content?.['application/json'];
        if (bodyContent?.schema?.properties) {
          Object.entries(bodyContent.schema.properties).forEach(([name, schema]: [string, any]) => {
            requestBodyFields.push({
              id: `rb-${Math.random()}`,
              name,
              type: schema.type || 'string',
              required: detail.requestBody.required || false,
              description: schema.description || ''
            });
          });
        }

        // 4. Response 추출 (200 OK 기준)
        const responseFields: Field[] = [];
        const successRes = detail.responses?.['200'] || detail.responses?.['201'];
        const resContent = successRes?.content?.['application/json'];
        if (resContent?.schema?.properties) {
          Object.entries(resContent.schema.properties).forEach(([name, schema]: [string, any]) => {
            responseFields.push({
              id: `res-${Math.random()}`,
              name,
              type: schema.type || 'string',
              required: true,
              description: schema.description || ''
            });
          });
        }

        // 5. API 아이템 생성
        const apiItem: ApiItem = {
          id: `a-${Math.random()}`,
          name: detail.summary || detail.operationId || `${method.toUpperCase()} ${path}`,
          method: method.toUpperCase() as any,
          path: path,
          description: detail.description || '',
          request: {
            params,
            headers,
            body: requestBodyFields
          },
          response: {
            headers: [],
            body: responseFields,
            statusCode: 200
          },
          mockConfig: {
            delay: 0,
            forcedError: null
          }
        };

        folders[tag].apis.push(apiItem);
      });
    });

    return Object.values(folders);
  } catch (error) {
    console.error('OpenAPI Parsing Error:', error);
    throw new Error('유효하지 않은 OpenAPI 규격입니다.');
  }
};
