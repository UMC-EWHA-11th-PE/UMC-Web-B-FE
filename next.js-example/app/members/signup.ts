import { apiClient } from "../lib/api-client";
import { unwrap, type ApiResponse } from "./auth";

type SignupRequest = {
  email: string;
  nickname: string;
  password: string;
};

type SignupResult = {
  memberId: number;
  email: string;
  nickname: string;
};

export type DuplicateField = "email" | "nickname";

export function checkDuplicate(field: DuplicateField, value: string) {
  return apiClient
    .get(`members/${field}/${encodeURIComponent(value)}`)
    .json<{ available: boolean }>();
}

export function signup(body: SignupRequest) {
  return unwrap(
    apiClient.post("members", { json: body }).json<ApiResponse<SignupResult>>(),
  );
}