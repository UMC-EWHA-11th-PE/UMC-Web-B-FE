import { apiClient } from '@/api/api-client';
export interface ApiResponse<T> { isSuccess: boolean; code: string; message: string; result: T | null }
export interface MemberInfo { email: string; nickname: string; createdAt?: string }
export async function unwrap<T>(request: PromiseLike<ApiResponse<T>>): Promise<T> {
  const response = await request;
  if (!response.isSuccess || response.result === null) throw new Error(response.message || '요청에 실패했어요.');
  return response.result;
}
export function login(body: { email: string; password: string }) {
  return unwrap(apiClient.post('auth/login', { json: body }).json<ApiResponse<{ nickname: string; accessToken: string }>>());
}
export function updateMember(nickname: string) {
  return unwrap(apiClient.patch('members/me', { json: { nickname } }).json<ApiResponse<MemberInfo>>());
}
