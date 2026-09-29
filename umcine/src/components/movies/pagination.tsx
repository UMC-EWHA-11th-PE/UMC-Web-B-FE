export default function Pagination() {
  const buttonClass =
    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#dddddd] bg-white p-0 text-sm text-[#555555]";

  return (
    <nav
      className="mt-14 flex items-center justify-center gap-2"
      aria-label="페이지 이동"
    >
      <button className={buttonClass} type="button">
        <img
          className="h-[18px] w-[18px]"
          src="/icons/chevron-left.svg"
          alt="이전 페이지"
        />
      </button>

      <button
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-blue-600 bg-blue-600 p-0 text-sm text-white"
        type="button"
      >
        1
      </button>

      <button className={buttonClass} type="button">
        2
      </button>

      <button className={buttonClass} type="button">
        3
      </button>

      <button className={buttonClass} type="button">
        <img
          className="h-[18px] w-[18px]"
          src="/icons/chevron-right.svg"
          alt="다음 페이지"
        />
      </button>
    </nav>
  );
}