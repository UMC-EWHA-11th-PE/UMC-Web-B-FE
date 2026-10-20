import {cn} from "../../utils/cn";

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
  if (totalPages < 1 || (totalPages === 1 && !showSinglePage)) {
    return null;
  }

  const visibleCount=5;

  const startPage=Math.max(
    1,
    Math.min(
      currentPage - Math.floor(visibleCount / 2),
      totalPages - visibleCount + 1
    )
  );

  const endPage = Math.min(totalPages, startPage + visibleCount - 1);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );
  
  const button =
    'grid size-8 shrink-0 cursor-pointer place-items-center rounded-md disabled:cursor-default disabled:text-slate-300';
  return (
    <nav
      aria-label="페이지 이동"
      className="mt-8 flex justify-center gap-2"
    >
      <button
        type="button"
        className={button}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {pages.map(page => (
        <button
          key={page}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(page)}
          className={cn(
            button,
            page === currentPage && 'bg-[#20242c] text-white',
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={button}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  );
}