import "./globals.css";
import Navbar from "./components/Navbar";
import ScrollReactiveBackdrop from "./components/ScrollReactiveBackdrop";
import { LanguageProvider } from "./contexts/LanguageContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col antialiased">
        <LanguageProvider>
          <ScrollReactiveBackdrop />
          <Navbar />

          {/* Main Content */}
          <main className="grow container mx-auto px-4 py-6 sm:py-10">
            {children}
          </main>

          {/* Footer */}
          <footer className="mt-auto border-t border-white/10 bg-black/20">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-white/60">
              <p>&copy; 2026 MyWatchlist Mini Project</p>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}