import {Link, useParams} from "react-router";
import { useState } from "react";
import {movies} from "../data/movies"
import "./movie-detail-page.css"

interface MovieDetailPageProps{
    bookmarkedIds: number[];
    onToggleBookmark: (movieId:number)=>void;
}

export default function MovieDetailPage({
    bookmarkedIds, onToggleBookmark
}: MovieDetailPageProps){
    const {movieId}=useParams();
    const movie= movies.find((item)=> item.id===Number(movieId));

    const [rating, setRating] =useState(0);
    if(!movie){
        return (
            <main className="detail-not-found">
                <h1>영화를 찾을 수 없습니다.</h1>
                <Link to="/">영화 목록으로 돌아가기</Link>
            </main>
        )
    }

    const isBookmarked = bookmarkedIds.includes(movie.id);

    return (
        <main className="movie-detail">
            
            <section className="detail-header"
                style={{ backgroundImage: `url("${movie.backdropPath}")` }}>
                    
                    <div className="detail-header-inner">
                        <Link className="back-link" to="/"> 〈 영화 목록 </Link>

                        <div className="inner-text">
                            <h1>{movie.title}</h1>
                            <p>{movie.originalTitle}</p>
                            <p>{movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime} </p>
                        </div>
                    </div>
                </section>

                <div className="detail-content">
                    <section className="detail-info" aria-label="영화 정보">
                        <img className="detail-poster" src={movie.posterPath} alt={`${movie.title} 포스터`}/>

                        <div className="detail-description">
                            <h2>{movie.tagline}</h2>
                            <p>{movie.overview}</p>
                            <button
                                type="button" className="detail-bookmark"
                                aria-pressed={isBookmarked} onClick={()=>onToggleBookmark(movie.id)}>
                                    {isBookmarked ? "즐겨찾기 해제": "즐겨찾기"}
                                </button>

                        </div>
                    </section>

                    <aside className="rating-panel">
                        <h2>내 평점</h2>
                        <p className="rating-help">별점은 필수, 후기는 선택이에요.</p>
                        <div className="rating-stars" role="group" aria-label="평점 선택">
                            {[1,2,3,4,5].map((star)=>(
                                <button key={star} type="button" className="rating-star" aria-label={`${star}점`} aria-pressed={rating===star} onClick={()=> setRating(star)}>
                                    <img src={star <= rating?"/icons/star.svg":"/icons/star-outline.svg" } alt=""/>
                                </button>
                            ))}
                        </div>

                        <textarea className="rating-review" aria-label="영화 후기" placeholder="영화를 보고 느낀 점을 남겨보세요"/>
                        <button className="rating-save" type="button">평점 저장</button>
                    </aside>
                </div>
        </main>

    )


}
