import type { TmdbMovieDetail } from "../../models";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ movieId: string }> },
) {
  const { movieId } = await params;

  if (!/^[1-9]\d*$/.test(movieId) || !Number.isSafeInteger(Number(movieId))) {
    return Response.json({ message: "올바르지 않은 영화 번호예요." }, { status: 400 });
  }

  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    return Response.json({ message: "영화 API 설정을 확인해 주세요." }, { status: 500 });
  }

  const url = new URL(`https://api.themoviedb.org/3/movie/${movieId}`);
  url.searchParams.set("language", "ko-KR");

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (response.status === 404) {
      return Response.json({ message: "영화를 찾을 수 없어요." }, { status: 404 });
    }

    if (!response.ok) {
      return Response.json({ message: "영화 정보를 불러오지 못했어요." }, { status: 502 });
    }

    const movie: TmdbMovieDetail = await response.json();

    return Response.json({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    });
  } catch {
    return Response.json({ message: "영화 정보를 불러오지 못했어요." }, { status: 502 });
  }
}