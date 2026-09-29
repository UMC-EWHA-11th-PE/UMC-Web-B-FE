//기본 페이지 영화목록 보여줌(URL이 /)

import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";

export const Route = createFileRoute("/")({
  component: MovieListPage,
});