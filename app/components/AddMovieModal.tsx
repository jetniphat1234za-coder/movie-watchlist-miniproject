"use client";

import { useState } from "react";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "กรุณากรอกชื่อหนังด้วยครับ" }),
  rating: z
    .number()
    .min(1)
    .max(10, { message: "คะแนนต้องอยู่ระหว่าง 1 ถึง 10" }),
  comment: z.string().optional(),
});

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle: string;
}

export default function AddMovieModal({
  isOpen,
  onClose,
  initialTitle,
}: AddMovieModalProps) {
  const [formData, setFormData] = useState({
    title: initialTitle,
    rating: 5,
    comment: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
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
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setFormData({ title: initialTitle, rating: 5, comment: "" });
          setSuccess(false);
        }, 1000);
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="rounded-lg shadow-2xl max-w-lg w-full p-8">
          <h1 className="text-2xl font-bold mb-6">
            📝 เพิ่มเข้า My Watchlist
          </h1>

          {success ? (
            <div className="text-center py-8">
              <p className="text-xl">✓ บันทึกสำเร็จ!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1">ชื่อหนัง *</label>
                <input
                  type="text"
                  className="w-full p-3 rounded focus:outline-none"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                {errors.title && (
                  <p className="text-sm mt-1">
                    {errors.title._errors[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1">
                  คะแนนความอยากดู (1-10) *
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    className="grow"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: Number(e.target.value) })
                    }
                  />
                  <span className="text-2xl font-bold w-12">
                    {formData.rating}
                  </span>
                </div>
                {errors.rating && (
                  <p className="text-sm mt-1">
                    {errors.rating._errors[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1">
                  ความรู้สึก / คอมเมนต์
                </label>
                <textarea
                  className="w-full p-3 rounded focus:outline-none"
                  rows={3}
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="เช่น ต้องไปดูในโรงให้ได้!"
                />
              </div>

              <div className="flex gap-3 pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 font-bold py-2 px-4 rounded transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 font-bold py-2 px-4 rounded transition disabled:opacity-50"
                >
                  {isSubmitting ? "กำลังบันทึก..." : "เก็บบันทึก"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
