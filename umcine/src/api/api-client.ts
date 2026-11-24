import ky from "ky";
import { env } from "../config/env";

// Spring Boot 서버에 요청을 보내는 공통 API 클라이언트
export const apiClient = ky.create({
  baseUrl: env.apiBaseUrl,
});
