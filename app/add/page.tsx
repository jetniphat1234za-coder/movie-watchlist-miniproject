"use client";

import { useState, Suspense } from "react";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

// Schema ของ Zod (ต้องเหมือนกับ Backend)
const formSchema = z.object({
  title: z.string().min(1, { message: "กรุณากรอกชื่อหนังด้วยครับ" }),
  rating: z.number().min(1).max(10, { message: "คะแนนต้องอยู่ระหว่าง 1 ถึง 10" }),
  comment: z.string().optional(),
});

function FormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ดึงชื่อหนังจาก URL (ถ้ามี) มาใส่เป็นค่าเริ่มต้น
  const initialTitle = searchParams.get("title") || "";

  const [formData, setFormData] = useState({ title: initialTitle, rating: 5, comment: "" });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // 1. ตรวจสอบข้อมูลด้วย Zod (Frontend)
    const validation = formSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(validation.error.format());
      setIsSubmitting(false);
      return;
    }

    // 2. ส่งข้อมูลไปที่ Backend API
    const res = await fetch("/api/watchlist", {
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
    <div className="max-w-lg mx-auto bg-gray-900 p-8 rounded-lg shadow-xl mt-10 text-white border border-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-center text-indigo-400">📝 เพิ่มหนังที่อยากดู</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-300 mb-1">ชื่อหนัง *</label>
          <input 
            type="text" 
            className="w-full bg-gray-800 border border-gray-600 p-3 rounded focus:outline-none focus:border-indigo-500 text-white"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title._errors[0]}</p>}
        </div>

        <div>
          <label className="block text-gray-300 mb-1">คะแนนความอยากดู (1-10) *</label>
          <input 
            type="number" 
            className="w-full bg-gray-800 border border-gray-600 p-3 rounded focus:outline-none focus:border-indigo-500 text-white"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
          />
          {errors.rating && <p className="text-red-400 text-sm mt-1">{errors.rating._errors[0]}</p>}
        </div>

        <div>
          <label className="block text-gray-300 mb-1">ความรู้สึก / คอมเมนต์</label>
          <textarea 
            className="w-full bg-gray-800 border border-gray-600 p-3 rounded focus:outline-none focus:border-indigo-500 text-white"
            rows={4}
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            placeholder="เช่น ต้องไปดูในโรงให้ได้!"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded transition"
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