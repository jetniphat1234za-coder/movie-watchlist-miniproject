"use client";

import { useLanguage } from "@/app/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1 rounded-full bg-white/5 border border-white/10 p-1">
      <button
        onClick={() => setLanguage("th")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
          language === "th"
            ? "bg-indigo-500/80 text-white"
            : "text-white/70 hover:text-white"
        }`}
      >
        ไทย
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
          language === "en"
            ? "bg-indigo-500/80 text-white"
            : "text-white/70 hover:text-white"
        }`}
      >
        ENG
      </button>
    </div>
  );
}
