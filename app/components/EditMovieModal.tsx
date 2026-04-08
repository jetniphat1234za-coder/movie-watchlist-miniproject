"use client";

import { useState } from "react";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "กรุณากรอกชื่อหนังด้วยครับ" }),
  rating: z.coerce
    .number()
    .int()
    .min(1)
    .max(10, { message: "คะแนนต้องอยู่ระหว่าง 1 ถึง 10" }),
  comment: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

interface EditMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  movie: {
    id: number;
    title: string;
    rating: number;
    comment: string | null;
  };
}

export default function EditMovieModal({
  isOpen,
  onClose,
  onSuccess,
  movie,
}: EditMovieModalProps) {
  const [formData, setFormData] = useState<FormData>(() => ({
    title: movie.title,
    rating: movie.rating,
    comment: movie.comment || "",
  }));
  const [errors, setErrors] = useState<z.ZodFormattedError<FormData> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);
    setSuccess(false);

    // ตรวจสอบข้อมูลด้วย Zod
    const validation = formSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(validation.error.format());
      setIsSubmitting(false);
      return;
    }

    // ส่งข้อมูลไปที่ Backend API
    try {
      const res = await fetch("/api/watchlist-v2", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: movie?.id,
          ...validation.data,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          onSuccess();
        }, 1000);
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch {
      alert("เกิดข้อผิดพลาด");
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-white/10 bg-neutral-950/80 backdrop-blur text-white animate-pop">
          <h1 className="text-2xl font-semibold mb-6 tracking-tight">
            ✏️ แก้ไขหนัง
          </h1>

          {success ? (
            <div className="text-center py-8">
              <p className="text-xl">✓ อัปเดตสำเร็จ!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 text-sm text-white/80">ชื่อหนัง *</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                {errors?.title?._errors?.[0] ? (
                  <p className="text-sm mt-1 text-red-300">
                    {errors.title._errors[0]}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="block mb-1 text-sm text-white/80">
                  คะแนนความอยากดู (1-10) *
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    className="grow accent-indigo-400"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: Number(e.target.value) })
                    }
                  />
                  <span className="text-2xl font-bold w-12">
                    {formData.rating}
                  </span>
                </div>
                {errors?.rating?._errors?.[0] ? (
                  <p className="text-sm mt-1 text-red-300">
                    {errors.rating._errors[0]}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="block mb-1 text-sm text-white/80">
                  ความรู้สึก / คอมเมนต์
                </label>
                <textarea
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                  rows={3}
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="เช่น ต้องไปดูในโรงให้ได้!"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 font-semibold py-2.5 px-4 rounded-xl transition disabled:opacity-50 bg-indigo-500/90 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20"
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl transition bg-white/5 hover:bg-white/10 border border-white/10 font-semibold"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
