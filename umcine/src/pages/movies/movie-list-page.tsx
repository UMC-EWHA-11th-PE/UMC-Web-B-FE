import MovieGrid from "../../components/movies/movie-grid";
import { movies } from "../../data/movies";
import Footer from "../../components/layout/footer";

export function MovieListPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-8 py-8">
        <h1 className="mb-6 text-3xl font-bold">
          영화 목록
        </h1>

        <MovieGrid movies={movies} />
      </main>

      <Footer />
    </>
  );
}