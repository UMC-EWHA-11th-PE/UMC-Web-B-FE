function Header() {
  return <h1>나만의 Movie 모음집</h1>;
}

function MovieList() {
  return (
    <ul>
      <MovieCard/>
      <li>너를 만난 여름</li>
      <li>인턴</li>
      <li>해리포터</li>
      <MovieCard/>
    </ul>
  );
}

function MovieCard() {
  return <h3>영화 목록</h3>
}

export default function App() {
  return (
    <main>
      <Header/>
      <MovieList />
    </main>
  );
}