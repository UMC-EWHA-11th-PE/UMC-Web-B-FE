import { isHTTPError } from "ky";

// 영화 상세 API 요청에 실패했을 때 오류 메시지를 구분하는 함수
export function getMovieDetailErrorMessage(error: unknown) {
  // HTTP 오류이면서 상태 코드가 404라면
  // 해당 영화가 존재하지 않는다는 메시지 반환
  if (isHTTPError(error) && error.response.status === 404) {
    return "영화를 찾을 수 없어요.";
  }

  // 그 외의 오류는 일반적인 요청 실패 메시지 반환
  return "영화 정보를 불러오지 못했어요.";
}
