"use client";

import { useState, Suspense } from "react";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

// Schema ของ Zod (ต้องเหมือนกับ Backend)
const formSchema = z.object({
  title: z.string().min(1, { message: "กรุณากรอกชื่อหนัง" }),
  rating: z.coerce
    .number()
    .int()
    .min(1)
    .max(10, { message: "คะแนนต้องอยู่ระหว่าง 1 ถึง 10" }),
  comment: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

function FormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ดึงชื่อหนังจาก URL (ถ้ามี) มาใส่เป็นค่าเริ่มต้น
  const initialTitle = searchParams.get("title") || "";

  const [formData, setFormData] = useState<FormData>({ title: initialTitle, rating: 5, comment: "" });
  const [errors, setErrors] = useState<z.ZodFormattedError<FormData> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);

    // 1. ตรวจสอบข้อมูลด้วย Zod (Frontend)
    const validation = formSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(validation.error.format());
      setIsSubmitting(false);
      return;
    }

    // 2. ส่งข้อมูลไปที่ Backend API
    const res = await fetch("/api/watchlist-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });

    if (res.ok) {
      alert("บันทึกหนังลง My Watchlist สำเร็จ!");
      router.push("/my-list"); // บันทึกเสร็จให้เด้งไปหน้าดูรายการหนัง
    } else {
      alert("เกิดข้อผิดพลาด");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-lg mx-auto rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-lg shadow-black/20 text-white">
      <h1 className="text-2xl font-semibold mb-6 text-center tracking-tight">เพิ่มหนังที่อยากดู</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-white/80 mb-1">ชื่อหนัง *</label>
          <input 
            type="text" 
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 text-white"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          {errors?.title?._errors?.[0] ? (
            <p className="text-red-300 text-sm mt-1">{errors.title._errors[0]}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">คะแนนความอยากดู (1-10) *</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              className="grow accent-indigo-400"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
            />
            <span className="text-2xl font-bold w-12 text-right">{formData.rating}</span>
          </div>
          {errors?.rating?._errors?.[0] ? (
            <p className="text-red-300 text-sm mt-1">{errors.rating._errors[0]}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm text-white/80 mb-1">ความรู้สึก / คอมเมนต์</label>
          <textarea 
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 text-white"
            rows={4}
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            placeholder="เช่น ต้องไปดูในโรงให้ได้!"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-indigo-500/90 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition disabled:opacity-50 shadow-sm shadow-indigo-500/20"
        >
          {isSubmitting ? "กำลังบันทึก..." : "เก็บบันทึกข้อมูล"}
        </button>
      </form>
    </div>
  );
}

export default function AddMovie() {
  return (
    <Suspense fallback={<div className="text-center text-white mt-10">กำลังโหลด...</div>}>
      <FormContent />
    </Suspense>
  );
}