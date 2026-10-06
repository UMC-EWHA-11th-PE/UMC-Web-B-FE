import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-8 flex justify-center gap-2" aria-label="페이지 이동">
      {pageNumbers.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "h-8 w-8 rounded-md border border-gray-300 bg-white text-gray-600",
            page === currentPage && "border-blue-600 bg-blue-600 font-bold text-white",
          )}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}