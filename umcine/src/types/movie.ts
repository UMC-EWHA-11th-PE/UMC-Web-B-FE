export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterPath: string;  //우리가 영화 목록 카드에서 보는 세로형 영화 포스터
  backdropPath: string; //영화 상세 페이지에서 크게 보여주는 가로형 배경 이미지
  genres: string[];
  runtime: string;
  tagline: string;
  overview: string;
  isBookmarked: boolean;
}