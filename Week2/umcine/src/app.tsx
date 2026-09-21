import { useState } from "react";
import { Route, Routes , useLocation} from "react-router";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { movies } from "./data/movies";
import MovieDetailPage from "./pages/movie-detail-page";
import { MovieListPage } from "./pages/movie-list-page";
import SearchPage from "./pages/search-page";
import "./app.css";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import MyPage from "./pages/my-page";
import type { UserProfile } from "./types/user";
import EditProfilePage from "./pages/edit-profile-page";


export default function App() {
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(
    movies.filter((movie) => movie.isBookmarked).map((movie) => movie.id),
  );

  const [profile, setProfile] = useState<UserProfile>({
    nickname: "gs0428",
    email: "gwangsoo@cinemalab.kr",
    avatarUrl: null,
  });

  function toggleBookmark(movieId: number) {
    setBookmarkedIds((current) =>
      current.includes(movieId)
        ? current.filter((id) => id !== movieId)
        : [...current, movieId],
    );
  }
  const {pathname} =useLocation();

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <MovieListPage
              movies={movies}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={toggleBookmark}
            />
          }
        />
        <Route
          path="/movies/:movieId"
          element={
            <MovieDetailPage
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={toggleBookmark}
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/me"
          element={
            <MyPage
              bookmarkedIds={bookmarkedIds}
              profile={profile}
            />
          }
        />
        <Route
          path="/me/edit"
          element={
            <EditProfilePage
              profile={profile}
              onSave={setProfile}
            />
          }
        />
      </Routes>
      {!["/login", "/signup"].includes(pathname) && <Footer />}
    </div>
  );
}
