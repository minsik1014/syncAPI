export function generateEndpointFromName(name: string, currentMethod: string = 'GET'): { method: string, path: string } {
  let resource = 'items';
  
  // Resource mapping
  if (name.includes('사용자') || name.includes('유저') || name.includes('회원')) resource = 'users';
  else if (name.includes('게시글') || name.includes('포스트') || name.includes('글')) resource = 'posts';
  else if (name.includes('댓글') || name.includes('리뷰')) resource = 'comments';
  else if (name.includes('상품') || name.includes('아이템')) resource = 'products';
  else if (name.includes('주문') || name.includes('결제')) resource = 'orders';
  else if (name.includes('이미지') || name.includes('파일')) resource = 'files';
  else if (name.includes('카테고리')) resource = 'categories';
  else if (name.includes('프로필')) resource = 'profiles';
  else if (name.includes('설정')) resource = 'settings';
  else if (name.includes('토큰') || name.includes('로그인') || name.includes('인증')) resource = 'auth';

  let method = currentMethod;
  let pathSuffix = '';

  // Action mapping
  if (name.includes('생성') || name.includes('추가') || name.includes('등록') || name.includes('작성')) {
    method = 'POST';
    pathSuffix = '';
  } else if (name.includes('수정') || name.includes('변경') || name.includes('업데이트')) {
    method = 'PUT';
    pathSuffix = '/:id';
  } else if (name.includes('삭제') || name.includes('지우기')) {
    method = 'DELETE';
    pathSuffix = '/:id';
  } else if (name.includes('상세') || name.includes('단건')) {
    method = 'GET';
    pathSuffix = '/:id';
  } else if (name.includes('목록') || name.includes('조회') || name.includes('검색')) {
    method = 'GET';
    pathSuffix = '';
  }

  // Auth exception
  if (resource === 'auth') {
    if (name.includes('로그인')) { method = 'POST'; pathSuffix = '/login'; }
    if (name.includes('로그아웃')) { method = 'POST'; pathSuffix = '/logout'; }
  }

  return {
    method,
    path: `/api/v1/${resource}${pathSuffix}`
  };
}
