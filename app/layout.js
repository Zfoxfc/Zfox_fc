import './globals.css';

export const metadata = {
  title: 'Zfox Fc - Gaming Tournament',
  description: 'Join the ultimate gaming experience',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0f1a] text-white antialiased">
        <nav className="p-5 border-b border-gray-800 bg-[#0b0f1a]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-black text-orange-500 tracking-tighter">ZFOX FC</h1>
            <button className="bg-orange-600 px-5 py-1.5 rounded-full text-sm font-bold">Login</button>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
    }
    
