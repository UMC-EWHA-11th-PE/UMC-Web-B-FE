export default function Pagination() {
  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button className="page-arrow" type="button">
        <img src="/icons/chevron-left.svg" alt="이전 페이지" />
      </button>

      <button className="page-number active" type="button">
        1
      </button>

      <button className="page-number" type="button">
        2
      </button>

      <button className="page-number" type="button">
        3
      </button>

      <button className="page-arrow" type="button">
        <img src="/icons/chevron-right.svg" alt="다음 페이지" />
      </button>
    </nav>
  );
}