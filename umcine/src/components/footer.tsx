import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="tmdb-attribution">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />

        <span>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <u>TMDB</u>.
        </span>
      </div>
    </footer>
  );
}