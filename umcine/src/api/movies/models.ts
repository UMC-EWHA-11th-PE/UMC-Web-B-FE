interface TmdbMovie {
  //목록과 상세 응답에 들어오는 필드
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

interface TmdbMovieListItem extends TmdbMovie {
  //TMdbMovie의 results
  genre_ids: number[];
}

interface TmdbMovieListResponse {
  page: number;
  results: TmdbMovieListItem[];
  total_pages: number;
  total_results: number;
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbMovieDetail extends TmdbMovie {
  //상세 응답 표현
  genres: TmdbGenre[];
  runtime: number | null;
  tagline: string;
}

export type {
  TmdbGenre,
  TmdbMovie,
  TmdbMovieDetail,
  TmdbMovieListItem,
  TmdbMovieListResponse,
};
