import { HTTPError } from "ky";

function getResponseMessage(body: unknown): string | undefined {
  if (
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return body.message.trim() || undefined;
  }
}

export async function errorMessage(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    const message = getResponseMessage(error.data);
    if (message) return message;

    try {
      const body: unknown = await error.response.clone().json();
      const responseMessage = getResponseMessage(body);
      if (responseMessage) return responseMessage;
    } catch {
      // 응답 본문을 읽을 수 없으면 HTTP 상태 번호를 표시합니다.
    }

    return `요청에 실패했어요. (${error.response.status})`;
  }

  return error instanceof Error
    ? error.message
    : "서버 연결을 확인해 주세요.";
}