import { ApiItem, Field } from '../store/useStore';

/**
 * 필드 목록을 바탕으로 샘플 JSON 객체를 생성합니다.
 */
export const generateSampleJson = (fields: Field[]): string => {
  const obj: Record<string, any> = {};
  
  fields.forEach(field => {
    switch (field.type) {
      case 'string': obj[field.name] = `sample_${field.name}`; break;
      case 'number': obj[field.name] = 123; break;
      case 'boolean': obj[field.name] = true; break;
      case 'array': obj[field.name] = []; break;
      case 'object': obj[field.name] = {}; break;
      default: obj[field.name] = null;
    }
  });

  return JSON.stringify(obj, null, 2);
};

/**
 * API 명세를 바탕으로 Axios 코드를 생성합니다.
 */
export const generateAxiosCode = (api: ApiItem): string => {
  const { method, path, name, request } = api;
  const funcName = name.replace(/\s+/g, '');
  
  let code = `import axios from 'axios';\n\n`;
  code += `/**\n * ${name}\n * Endpoint: ${path}\n */\n`;
  code += `export const ${funcName} = async (data) => {\n`;
  code += `  const response = await axios({\n`;
  code += `    method: '${method.toLowerCase()}',\n`;
  code += `    url: \`\${process.env.NEXT_PUBLIC_API_URL}${path}\`,\n`;
  
  if (['POST', 'PUT', 'PATCH'].includes(method) && request.body.length > 0) {
    code += `    data,\n`;
  }
  
  if (request.params.length > 0) {
    code += `    params: data.params,\n`;
  }

  code += `  });\n`;
  code += `  return response.data;\n`;
  code += `};`;
  
  return code;
};

/**
 * API 명세를 바탕으로 React Query (TanStack Query) 코드를 생성합니다.
 */
export const generateReactQueryCode = (api: ApiItem): string => {
  const { method, name } = api;
  const funcName = name.replace(/\s+/g, '');
  const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
  
  let code = `import { use${isMutation ? 'Mutation' : 'Query'} } from '@tanstack/react-query';\n`;
  code += `import { ${funcName} } from './api';\n\n`;
  
  if (isMutation) {
    code += `export const use${funcName} = () => {\n`;
    code += `  return useMutation({\n`;
    code += `    mutationFn: (data) => ${funcName}(data),\n`;
    code += `    onSuccess: (data) => {\n`;
    code += `      console.log('Success:', data);\n`;
    code += `    },\n`;
    code += `  });\n`;
    code += `};`;
  } else {
    code += `export const use${funcName} = (params) => {\n`;
    code += `  return useQuery({\n`;
    code += `    queryKey: ['${funcName}', params],\n`;
    code += `    queryFn: () => ${funcName}(params),\n`;
    code += `  });\n`;
    code += `};`;
  }
  
  return code;
};
