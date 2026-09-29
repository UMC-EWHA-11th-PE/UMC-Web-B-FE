interface MovieCardProps {
  title: string;
  releaseDate: string;
  isBookmarked: boolean;
}

function Header() {
  return <h1>나만의 Movie 모음집</h1>;
}

function MovieList() {
  return (
    <div>
    <br />
      <MovieCard
        title="너를 만난 여름"
        releaseDate="2023.06.28"
        isBookmarked={true}
      />
    <br />

      <MovieCard
        title="인턴"
        releaseDate="2015.09.24"
        isBookmarked={false}
      />
    <br />
      <MovieCard
        title="해리포터"
        releaseDate="2001.12.14"
        isBookmarked={true}
      />
    </div>
  );
}

function MovieCard({
  title,
  releaseDate,
  isBookmarked,
}: MovieCardProps) {
  return (
    <main>
      <h2>{title}</h2>
      <p>{releaseDate}</p>
      <p>{isBookmarked ? "북마크됨" : "북마크 안 됨"}</p>
    </main>
  );
}

export default function App() {
  return (
    <main>
      <Header/>
      <MovieList />
    </main>
  );
}