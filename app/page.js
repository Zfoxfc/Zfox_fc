import { fetchData } from '@/lib/api';
import JoinModal from '@/components/JoinModal';
import NotificationBar from '@/components/Notification';

export default async function Home() {
  const games = await fetchData("Tournaments");

  return (
    <main className="max-w-6xl mx-auto p-4">
      <NotificationBar />
      <h2 className="text-2xl font-bold my-8 italic border-l-4 border-orange-500 pl-3 uppercase tracking-tighter">Matches Lobby</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(games) && games.map((g, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
             <div>
               <h3 className="text-xl font-bold text-slate-100">{g.Title}</h3>
               <p className="text-green-500 font-bold my-2">Prize: ৳{g.Prize_Pool}</p>
               <p className="text-xs text-slate-500 mb-6 italic">Entry: ৳{g.Entry_Fee}</p>
             </div>
             <JoinModal game={g} />
          </div>
        ))}
      </div>
    </main>
  );
    }
    
