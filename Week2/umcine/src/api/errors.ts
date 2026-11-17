import { HTTPError } from 'ky';
export async function errorMessage(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body = await error.response.clone().json();
      if (typeof body.message === 'string') return body.message;
    } catch { /* Non-JSON response. */ }
    return `요청에 실패했어요. (${error.response.status})`;
  }
  return error instanceof Error ? error.message : '서버 연결을 확인해 주세요.';
}
