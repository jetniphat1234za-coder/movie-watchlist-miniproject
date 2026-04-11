"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

export type Language = "th" | "en";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  th: {
    // Navbar
    discover: "ค้นหา",
    watchlist: "รายการของฉัน",
    add: "เพิ่มหนัง",

    // Home/Discover
    featured_tonight: "แนะนำสำหรับคืนนี้",
    hero_title: "ค้นหาหนังที่คุณอยากดู",
    hero_subtitle: "ค้นหาและบันทึกเรื่องโปรดของคุณ",
    explore: "สำรวจ",
    search_placeholder: "ค้นหาหนัง...",
    browse_films: "ค้นหาหนัง",
    trending: "กำลังมาแรง",
    trending_subtitle: "สิ่งที่ทุกคนกำลังรับชมอยู่ในขณะนี้",
    popular: "ยอดนิยม",
    popular_subtitle: "เรื่องโปรดขวัญใจมหาชน",
    top_rated: "เรตติ้งสูงสุด",
    top_rated_subtitle: "ผลงานคัดสรรที่ได้รับคำชมจากนักวิจารณ์",
    trending_now: "กำลังดูเยอะ",
    trending_now_subtitle: "หนังที่ยิ่งใหญ่ที่สุดในตอนนี้",
    popular_movies: "หนังยอดนิยม",
    popular_movies_subtitle: "หนังโปรดของผู้ชมที่เริ่มดูคืนนี้ได้",

    // My Watchlist
    saved_collection: "คอลเลกชันที่บันทึกไว้",
    watchlist_title: "รายการของฉัน",
    watchlist_subtitle: "เก็บรายการให้สั้นเข้าไว้ ใส่ใจในสิ่งที่เลือก แก้ไขบันทึก และขัดเกลารสนิยมของคุณ",
    nothing_saved: "ยังไม่มีหนังที่บันทึก",
    nothing_saved_desc: "เริ่มด้วยหนังเรื่องหนึ่งที่คุณอยากดูจริงๆ เก็บรักษาให้สั้นและมีความหมาย",
    add_from_home: "+ เพิ่มจากหน้าแรก",
    add_manually: "เพิ่มแบบแมนนวล",
    saved_count: "ที่บันทึก",
    empty_state: "ว่างเปล่า",
    browse_films: "ค้นหาหนัง",
    edit: "แก้ไข",
    remove: "ลบ",
    edit_notes: "แก้ไขหมายเหตุเพื่อจำสาเหตุได้",
    no_note_yet: "ยังไม่มีหมายเหตุ — เพิ่มหมายเหตุเพื่อจำความรู้สึก",
    saved_date: "บันทึกเมื่อ",
    loading_error_title: "มีปัญหาในการโหลด",
    retry: "ลองใหม่",
    problem_loading: "เกิดปัญหาในการโหลด",

    // Add Movie
    add_movie_title: "เพิ่มหนังที่อยากดู",
    search_tmdb: "ค้นหาหนัง (จาก TMDB)",
    search_tmdb_placeholder: "พิมพ์ชื่อหนัง...",
    movie_title: "ชื่อหนัง",
    movie_rating: "คะแนนความอยากดู (1-10)",
    movie_comment: "ความรู้สึก / คอมเมนต์",
    movie_comment_placeholder: "เช่น ต้องไปดูในโรงให้ได้!",
    clear_selection: "× ล้างการเลือก",
    save_movie: "เก็บบันทึกข้อมูล",
    saving: "กำลังบันทึก...",
    loading: "กำลังโหลด...",

    // Alerts
    save_success: "บันทึกสำเร็จ!",
    save_success_desc: "เพิ่มหนังลง My Watchlist เรียบร้อยแล้ว",
    error: "เกิดข้อผิดพลาด",
    save_error: "ไม่สามารถบันทึกหนังได้ กรุณาลองใหม่",
    loading_error: "โหลดรายการหนังไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
    retry: "ลองใหม่",

    // Delete
    delete_title: "ลบหนังจากรายการ",
    delete_confirm: "คุณแน่ใจว่าต้องการลบหนังเรื่องนี้ออกจากรายการหรือ?",
    delete_error: "ไม่สามารถลบหนังได้ กรุณาลองใหม่",
    connection_error: "เกิดปัญหาในการเชื่อมต่อ กรุณาลองใหม่",
    confirm: "ยืนยัน",
    deleting: "กำลังลบ...",
    del: "ลบ",
    cancel: "ยกเลิก",

    // Search
    search_results: "ผลการค้นหา",
    searching: "กำลังค้นหา...",
    found_movies: "พบหนัง",
    movie_singular: "เรื่อง",
    movie_plural: "เรื่อง",
    no_movies_found: "ไม่พบหนังสำหรับ",
    try_another_search: "ลองค้นหาอีกครั้ง",
    sort_rating_high: "⭐ คะแนน (สูงไปต่ำ)",
    sort_rating_low: "⭐ คะแนน (ต่ำไปสูง)",
    sort_name: "เรียงตามชื่อ (ก-ฮ)",
    no_image: "ไม่มีภาพ",
    add_to_watchlist: "+ เพิ่มเข้า Watchlist",
    no_description: "ไม่มีคำอธิบาย",
  },
  en: {
    // Navbar
    discover: "Discover",
    watchlist: "Watchlist",
    add: "Add",

    // Home/Discover
    featured_tonight: "Featured Tonight",
    hero_title: "Discover films you want to watch",
    hero_subtitle: "Search and save your favorites",
    explore: "Explore",
    search_placeholder: "Search movies...",
    browse_films: "Browse films",
    trending: "Trending",
    trending_subtitle: "What everyone is watching now",
    popular: "Popular",
    popular_subtitle: "Big audience favorites",
    top_rated: "Top Rated",
    top_rated_subtitle: "Critically acclaimed picks",
    trending_now: "Trending Now",
    trending_now_subtitle: "Today's biggest movies across TMDB",
    popular_movies: "Popular Movies",
    popular_movies_subtitle: "Audience favorites you can start tonight",

    // My Watchlist
    saved_collection: "saved collection",
    watchlist_title: "Watchlist",
    watchlist_subtitle: "Keep a short list. Make it intentional. Edit notes, refine taste.",
    nothing_saved: "Nothing saved yet.",
    nothing_saved_desc: "Start with one film you genuinely want to watch. Keep the list short and meaningful.",
    add_from_home: "+ Browse films",
    add_manually: "Add manually",
    saved_count: "saved",
    empty_state: "Empty state",
    browse_films: "Browse films",
    edit: "Edit",
    remove: "Remove",
    edit_notes: "Tip: edit notes to remember why.",
    no_note_yet: 'No note yet — add one to remember the vibe.',
    saved_date: "Saved",
    loading_error_title: "Loading problem",
    retry: "Retry",
    problem_loading: "There was a problem loading",

    // Add Movie
    add_movie_title: "Add a film to your watchlist",
    search_tmdb: "Search movie (from TMDB)",
    search_tmdb_placeholder: "Type movie name...",
    movie_title: "Movie title *",
    movie_rating: "Rating (1-10) *",
    movie_comment: "Feelings / Comments",
    movie_comment_placeholder: "e.g., Must watch in theaters!",
    clear_selection: "× Clear selection",
    save_movie: "Save to watchlist",
    saving: "Saving...",
    loading: "Loading...",

    // Alerts
    save_success: "Saved!",
    save_success_desc: "Added to your watchlist successfully",
    error: "Error",
    save_error: "Unable to save movie. Please try again.",
    loading_error: "Failed to load watchlist. Please try again.",
    retry: "Retry",

    // Delete
    delete_title: "Remove from watchlist",
    delete_confirm: "Are you sure you want to remove this movie?",
    delete_error: "Unable to remove movie. Please try again.",
    connection_error: "Connection error. Please try again.",
    confirm: "Confirm",
    deleting: "Deleting...",
    del: "Delete",
    cancel: "Cancel",

    // Search
    search_results: "Search Results",
    searching: "Searching...",
    found_movies: "Found",
    movie_singular: "movie",
    movie_plural: "movies",
    no_movies_found: "No movies found for",
    try_another_search: "Try Another Search",
    sort_rating_high: "⭐ Rating (High to Low)",
    sort_rating_low: "⭐ Rating (Low to High)",
    sort_name: "A-Z Sorted",
    no_image: "No Image",
    add_to_watchlist: "+ Add to Watchlist",
    no_description: "No description available",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("language") as Language | null;
      if (saved && ["th", "en"].includes(saved)) {
        setLanguageState(saved);
      } else {
        // Default to Thai if localStorage is empty
        setLanguageState("th");
      }
    } catch (error) {
      // localStorage might not be available during SSR
      console.error("Error accessing localStorage:", error);
      setLanguageState("th");
    }
    setIsMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  const currentLanguage: Language = language && (language === "th" || language === "en") ? language : "en";

  const t = (key: string): string => {
    if (!currentLanguage || !translations[currentLanguage]) {
      const fallback = translations["en"];
      return (fallback && fallback[key]) || key;
    }
    try {
      const translation = translations[currentLanguage][key];
      if (!translation) {
        return translations["en"][key] || key;
      }
      return translation;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return key;
    }
  };

  // Memoize the context value to prevent unnecessary re-renders of Consumer components
  const contextValue = useMemo(
    () => ({ language: currentLanguage, setLanguage, t }),
    [currentLanguage]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
