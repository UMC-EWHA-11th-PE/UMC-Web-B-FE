import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const WINDOW_SIZE = 5;

function getPageNumbers(currentPage: number, totalPages: number): number[] {
  const half = Math.floor(WINDOW_SIZE / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + WINDOW_SIZE - 1);
  start = Math.max(1, end - WINDOW_SIZE + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const buttonClass =
    "h-8 w-8 rounded-md border border-gray-300 bg-white text-gray-600 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      className="mt-8 flex flex-wrap justify-center gap-2"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        className={buttonClass}
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            buttonClass,
            page === currentPage &&
              "border-blue-600 bg-blue-600 font-bold text-white",
          )}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={buttonClass}
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </nav>
  );
}
