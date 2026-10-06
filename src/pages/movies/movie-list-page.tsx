import "../../App.css";
import MovieGrid from "../../components/movie-grid";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../utils/bookmark-storage";

export function MovieListPage() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const movieList = movies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  return (
    <div>
      <main>
        <div className="page-title">
          <h2>영화 목록</h2>
        </div>

        <MovieGrid
          movies={movieList}
          onBookmarkToggle={toggleBookmark}
        />
      </main>

      <footer className="footer">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
}