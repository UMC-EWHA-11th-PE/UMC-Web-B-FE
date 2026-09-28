import { Link } from '@tanstack/react-router';
import type { Movie } from '../../types/movie';
import { cn } from '../../utils/cn';
interface MovieCardProps { movie: Movie; isBookmarked: boolean; onToggleBookmark: (movieId: number) => void; }
export function MovieCard({ movie, isBookmarked, onToggleBookmark }: MovieCardProps) {
  return <article className="min-w-0">
    <div className="relative">
      <Link to="/movies/$movieId" params={{movieId: String(movie.id)}} className="block overflow-hidden rounded-[9px]"><img src={movie.posterPath} alt={movie.title + ' 포스터'} className="aspect-[0.88] w-full object-cover transition-transform hover:scale-105" /></Link>
      <button type="button" aria-label={movie.title + ' 즐겨찾기 ' + (isBookmarked ? '해제' : '추가')} aria-pressed={isBookmarked} onClick={() => onToggleBookmark(movie.id)} className={cn('absolute right-[9px] top-[9px] grid h-[38px] w-[34px] cursor-pointer place-items-center rounded-lg border border-white bg-[#20242c]', isBookmarked && 'border-blue-600 bg-blue-600')}><img src={isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'} alt="" className="size-[22px] invert" /></button>
    </div>
    <h2 className="mb-[3px] mt-2 truncate text-sm font-extrabold"><Link to="/movies/$movieId" params={{movieId: String(movie.id)}}>{movie.title}</Link></h2>
    <p className="text-xs text-slate-500">{movie.releaseDate}</p>
  </article>;
}

