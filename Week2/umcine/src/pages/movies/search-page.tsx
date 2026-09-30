import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useState, type SubmitEvent } from 'react';
import { movies } from '../../data/movie';
import { cn } from '../../utils/cn';

function SearchForm({ query }: { query: string }) {
  const [searchText, setSearchText] = useState(query);
  const navigate = useNavigate({from: '/search'});
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    void navigate({search: searchText.trim() ? {query: searchText.trim()} : {}});
  }
  return <form onSubmit={handleSubmit} className="flex h-11 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
    <img src="/icons/search.svg" alt="" className="size-[17px]" />
    <input type="search" aria-label="검색어" placeholder="영화 제목을 검색해 보세요" value={searchText} onChange={event => setSearchText(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
    <button type="submit" className="cursor-pointer rounded bg-[#20242c] px-3 py-2 text-xs font-bold text-white">검색</button>
  </form>;
}
export function SearchPage() {
  const { query = '' } = useSearch({from: '/search'});
  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery ? movies.filter(movie => movie.title.toLowerCase().includes(normalizedQuery) || movie.originalTitle.toLowerCase().includes(normalizedQuery)) : [];
  return <main className={cn('mx-auto w-full max-w-[1320px] flex-1 px-5 pb-16 pt-5', !normalizedQuery && 'max-w-[960px] pt-[120px]')}>
    <h1 className={cn('mb-4 text-[28px] font-extrabold', !normalizedQuery && 'mb-[22px] text-center text-[40px]')}>영화 검색</h1>
    <SearchForm key={query} query={query} />
    {!normalizedQuery ? <p className="mt-6 text-center text-sm text-slate-500">검색어를 입력해 주세요.</p> : <>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 py-4"><h2 className="break-all text-lg font-extrabold">‘{query}’ 검색 결과</h2><p className="shrink-0 text-xs text-slate-500">영화 {results.length}편</p></div>
      {results.length === 0 ? <p className="py-16 text-center text-slate-500">검색 결과가 없어요.</p> : <ul className="grid gap-x-7 min-[701px]:grid-cols-2">
        {results.map(movie => <li key={movie.id} className="flex min-w-0 gap-4 border-b border-slate-200 py-4">
          <Link to="/movies/$movieId" params={{movieId: String(movie.id)}} className="shrink-0"><img src={movie.posterPath} alt={movie.title + ' 포스터'} className="h-[166px] w-[110px] rounded-lg object-cover" /></Link>
          <div className="flex min-w-0 flex-1 flex-col items-start"><h3 className="mb-1.5 text-[15px] font-extrabold"><Link to="/movies/$movieId" params={{movieId: String(movie.id)}}>{movie.title}</Link></h3><p className="mb-2 text-[11px] leading-relaxed text-slate-500">{movie.originalTitle}<br />{movie.releaseDate}</p><p className="mb-3 text-xs leading-relaxed text-slate-600">{movie.overview}</p><Link to="/movies/$movieId" params={{movieId: String(movie.id)}} className="mt-auto text-xs font-bold text-blue-600">상세 보기 →</Link></div>
        </li>)}
      </ul>}
    </>}
  </main>;
}

