import { isHTTPError } from "ky";

// 영화 검색 API 요청에 실패했을 때 오류 메시지를 구분하는 함수
export function getSearchErrorMessage(error: unknown): string {
  // ky에서 발생한 HTTP 오류인지 확인
  if (isHTTPError(error)) {
    // HTTP 상태 코드에 따라 다른 오류 메시지 반환
    switch (error.response.status) {
      case 401:
        return "API 인증에 실패했어요.";

      case 404:
        return "요청한 정보를 찾을 수 없어요.";

      case 429:
        return "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.";
    }
  }

  // 그 외의 오류는 일반적인 검색 실패 메시지 반환
  return "검색 결과를 불러오지 못했어요.";
}
