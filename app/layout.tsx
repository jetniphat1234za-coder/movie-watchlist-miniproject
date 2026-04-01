import './globals.css'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">🎬 MyWatchlist</Link>
            <div className="space-x-4">
              <Link href="/" className="hover:underline">หน้าแรก (API)</Link>
              <Link href="/my-list" className="hover:underline">หนังของฉัน (DB)</Link>
              <Link href="/add" className="hover:underline">เพิ่มรีวิว</Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="grow container mx-auto p-4">
          {children}
        </main>

        {/* Footer */}
        <footer className="text-center p-4 mt-auto">
          <p>&copy; 2026 MyWatchlist Mini Project</p>
        </footer>
      </body>
    </html>
  )
}