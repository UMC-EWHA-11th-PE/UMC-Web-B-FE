import { useState } from "react";
import { Link } from "react-router";
import { Pagination } from "../components/pagination";
import { movies } from "../data/movies";
import type { UserProfile } from "../types/user";
import "./my-page.css";

interface MyPageProps {
  bookmarkedIds: number[];
  profile: UserProfile;
}

const PAGE_SIZE = 3;

export default function MyPage({ bookmarkedIds, profile }: MyPageProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const favorites = movies.filter((movie) =>
    bookmarkedIds.includes(movie.id),
  );
  const totalPages = Math.max(1, Math.ceil(favorites.length / PAGE_SIZE));
  const visibleMovies = favorites.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <main className="my-page">
      <div className="my-page-inner">
        <div className="my-page-heading">
          <h1>내 정보</h1>
          <Link className="edit-profile-link" to="/me/edit">
            정보 수정
          </Link>
        </div>

        <section className="profile-section" aria-labelledby="profile-title">
          <h2 id="profile-title">기본 정보</h2>

          <div className="profile-summary">
            <div className="profile-avatar">
              <img
                src={profile.avatarUrl ?? "/icons/person.svg"}
                alt={profile.avatarUrl ? "프로필 이미지" : ""}
                className={profile.avatarUrl ? "uploaded-avatar" : ""}
              />
            </div>

            <div className="profile-field">
              <span>닉네임</span>
              <strong>{profile.nickname}</strong>
            </div>

            <div className="profile-field">
              <span>이메일</span>
              <strong>{profile.email}</strong>
            </div>
          </div>
        </section>

        <section className="favorites-section" aria-labelledby="favorites-title">
          <h2 id="favorites-title">내 즐겨찾기</h2>

          {favorites.length === 0 ? (
            <p className="favorites-empty">즐겨찾기한 영화가 없습니다.</p>
          ) : (
            <>
              <div className="favorite-grid">
                {visibleMovies.map((movie) => (
                  <article className="favorite-card" key={movie.id}>
                    <Link to={`/movies/${movie.id}`}>
                      <img
                        src={movie.posterPath}
                        alt={`${movie.title} 포스터`}
                      />
                      <h3>{movie.title}</h3>
                    </Link>
                    <p>{movie.releaseDate}</p>
                  </article>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showSinglePage
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}