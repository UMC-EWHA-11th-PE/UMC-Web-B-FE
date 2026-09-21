interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showSinglePage?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showSinglePage = false,
}: PaginationProps) {
  if (totalPages <= 1 && !showSinglePage) return null;

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      <button
        type="button"
        className="current"
        aria-current="page"
      >
        {currentPage}
      </button>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  );
}