import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0f172a] text-white">
        <nav className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-50">
          <h1 className="text-2xl font-black text-orange-500 italic">ZFOX FC</h1>
        </nav>
        {children}
      </body>
    </html>
  );
}
