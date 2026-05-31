import { Project, FolderItem, ApiItem } from '../store/useStore';

/**
 * SyncAPI 데이터를 Postman Collection v2.1 형식으로 변환합니다.
 */
export const exportToPostman = (project: Project, folders: FolderItem[]) => {
  const collection = {
    info: {
      name: project.title,
      description: project.description,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: folders.map(folder => ({
      name: folder.name,
      item: folder.apis.map(api => ({
        name: api.name,
        request: {
          method: api.method,
          header: api.request.headers.map(h => ({
            key: h.name,
            value: h.description || "",
            type: "text",
            description: h.description
          })),
          url: {
            raw: `{{baseUrl}}${api.path}`,
            host: ["{{baseUrl}}"],
            path: api.path.split('/').filter(p => p !== ""),
            query: api.request.params.map(p => ({
              key: p.name,
              value: p.description || "",
              description: p.description
            }))
          },
          body: api.method !== 'GET' ? {
            mode: "raw",
            raw: JSON.stringify(
              api.request.body.reduce((acc: any, field) => {
                acc[field.name] = field.type === 'number' ? 0 : field.type === 'boolean' ? true : `sample_${field.name}`;
                return acc;
              }, {}),
              null, 2
            ),
            options: {
              raw: {
                language: "json"
              }
            }
          } : undefined,
          description: api.description
        },
        response: []
      }))
    })),
    variable: [
      {
        key: "baseUrl",
        value: project.baseUrl || `https://mock.syncapi.dev/p-${project.id}`,
        type: "string"
      }
    ]
  };

  // 파일 다운로드 실행
  const blob = new Blob([JSON.stringify(collection, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${project.title.replace(/\s+/g, '_')}_Postman_Collection.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
