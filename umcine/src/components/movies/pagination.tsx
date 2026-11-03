// 부모 컴포넌트에서 전달받을 데이터의 타입
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const buttonClass =
    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#dddddd] bg-white p-0 text-sm text-[#555555]";

  // 현재 페이지를 기준으로 표시할 페이지 번호 3개 계산
  const startPage = Math.max(1, Math.min(page - 1, totalPages - 2));

  const pageNumbers = Array.from(
    { length: Math.min(3, totalPages) },
    (_, index) => startPage + index,
  );

  return (
    <nav
      className="mt-14 flex items-center justify-center gap-2"
      aria-label="페이지 이동"
    >
      {/* 이전 페이지 버튼 */}
      <button
        className={buttonClass}
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <img
          className="h-[18px] w-[18px]"
          src="/icons/chevron-left.svg"
          alt="이전 페이지"
        />
      </button>

      {/* 페이지 번호 버튼 */}
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={
            page === pageNumber
              ? "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-blue-600 bg-blue-600 p-0 text-sm text-white"
              : buttonClass
          }
          type="button"
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        className={buttonClass}
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <img
          className="h-[18px] w-[18px]"
          src="/icons/chevron-right.svg"
          alt="다음 페이지"
        />
      </button>
    </nav>
  );
}
