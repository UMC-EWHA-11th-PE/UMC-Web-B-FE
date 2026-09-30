import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { movies } from "../data/movies";
import "./search-page.css";

interface SearchFormProps {
  initialQuery: string;
  isResultsPage: boolean;
}

function SearchForm({ initialQuery, isResultsPage }: SearchFormProps) {
  const [input, setInput] = useState(initialQuery);
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = input.trim();
    if (!query) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  function clearSearch() {
    setInput("");
    navigate("/search");
  }

  return (
    <form
      className={`search-form ${isResultsPage ? "results-search-form" : ""}`}
      onSubmit={handleSubmit}
    >
      <img src="/icons/search.svg" alt="" aria-hidden="true" />

      <input
        type="search"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="예: 스파이더맨"
        aria-label="영화 제목 검색"
      />

      {isResultsPage && input && (
        <button
          className="search-clear"
          type="button"
          onClick={clearSearch}
          aria-label="검색어 지우기"
        >
          ×
        </button>
      )}

      <button className="search-submit" type="submit">
        {isResultsPage ? "다시 검색" : "검색"}
      </button>
    </form>
  );
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  // 검색어가 없을 때: 기존 가운데 검색 화면
  if (!query) {
    return (
      <main className="search-page">
        <section className="search-section">
          <h1>어떤 영화를 찾고 있나요?</h1>
          <SearchForm
            key="empty"
            initialQuery=""
            isResultsPage={false}
          />
        </section>
      </main>
    );
  }

  // 영화 제목과 원제에서 검색
  const normalizedQuery = query.toLocaleLowerCase();
  const results = movies.filter(
    (movie) =>
      movie.title.toLocaleLowerCase().includes(normalizedQuery) ||
      movie.originalTitle.toLocaleLowerCase().includes(normalizedQuery),
  );

  return (
    <main className="search-results-page">
      <div className="search-results-content">
        <h1>영화 검색</h1>

        <SearchForm
          key={query}
          initialQuery={query}
          isResultsPage
        />

        <div className="results-heading">
          <h2>‘{query}’ 검색 결과</h2>
          <p>영화 {results.length}편 · 1페이지</p>
        </div>

        {results.length === 0 ? (
          <p className="no-results">검색 결과가 없습니다. 다른 제목으로 검색해 보세요.</p>
        ) : (
          <div className="results-grid">
            {results.map((movie) => (
              <article className="result-card" key={movie.id}>
                <Link className="result-poster-link" to={`/movies/${movie.id}`}>
                  <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
                </Link>

                <div className="result-info">
                  <h3>{movie.title}</h3>
                  <p className="result-meta">
                    {movie.originalTitle} &nbsp; {movie.releaseDate}
                  </p>
                  <p className="result-overview">{movie.overview}</p>
                  <Link className="result-detail-link" to={`/movies/${movie.id}`}>
                    상세 보기 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
