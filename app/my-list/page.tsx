"use client";

import { useEffect, useState } from "react";
import type { Watchlist } from "@prisma/client";
import EditMovieModal from "@/app/components/EditMovieModal";

export default function MyList() {
  const [movies, setMovies] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState<Watchlist | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ดึงข้อมูลหนังจาก API
  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/watchlist");
      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // เปิด Modal สำหรับแก้ไข
  const handleEditClick = (movie: Watchlist) => {
    setEditingMovie(movie);
    setIsEditModalOpen(true);
  };

  // ลบหนัง
  const handleDelete = async (id: number) => {
    if (confirm("คุณแน่ใจหรือว่าต้องการลบหนังเรื่องนี้?")) {
      try {
        const res = await fetch("/api/watchlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (res.ok) {
          setMovies(movies.filter((m) => m.id !== id));
        } else {
          alert("เกิดข้อผิดพลาดในการลบ");
        }
      } catch (error) {
        alert("เกิดข้อผิดพลาด");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-10">
        <p>กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">
        🗂️ คลังหนังของฉัน (My Watchlist)
      </h1>

      {movies.length === 0 ? (
        <div className="text-center mt-10 p-10 rounded-lg">
          <p className="text-xl">ยังไม่มีหนังในรายการเลยครับ</p>
          <p className="mt-2">ลองไปที่หน้าแรกแล้วกดเพิ่มหนังดูสิ!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="p-6 rounded-lg shadow-md flex flex-col"
            >
              <h2 className="text-xl font-bold mb-2 line-clamp-2">
                {movie.title}
              </h2>

              <div className="mb-4 inline-block">
                <span className="text-sm font-bold px-3 py-1 rounded-full">
                  ⭐ {movie.rating} / 10
                </span>
              </div>

              <p className="italic grow">
                {movie.comment ? `"${movie.comment}"` : "- ไม่มีคอมเมนต์ -"}
              </p>

              <div className="mt-5 pt-4 text-xs text-right mb-4">
                บันทึกเมื่อ: {new Date(movie.createdAt).toLocaleDateString("th-TH")}
              </div>

              {/* ปุ่มแก้ไขและลบ */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditClick(movie)}
                  className="flex-1 font-semibold px-3 py-2 rounded transition text-sm"
                >
                  ✏️ แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(movie.id)}
                  className="flex-1 font-semibold px-3 py-2 rounded transition text-sm"
                >
                  🗑️ ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <EditMovieModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchMovies}
        movie={editingMovie}
      />
    </div>
  );
}