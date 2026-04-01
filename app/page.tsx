import MovieCard from './components/MovieCard';

export default async function Home() {
  const apiKey = process.env.TMDB_API_KEY;
  
  // ดึงข้อมูลหนังที่กำลังเป็นกระแสจาก TMDB (รองรับภาษาไทย)
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=th-TH`, 
    { cache: 'no-store' }
  );
  
  const data = await res.json();
  // เลือกข้อมูลมาแสดงแค่ 6 เรื่อง
  const movies = data.results ? data.results.slice(0, 6) : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">
        🔥 หนังฮิตวันนี้จาก TMDB
      </h1>
      
      {/* โครงสร้าง Grid สำหรับ Responsive Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {movies.map((movie: any) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title || movie.name}
            overview={movie.overview}
            poster_path={movie.poster_path}
          />
        ))}
      </div>
    </div>
  );
}