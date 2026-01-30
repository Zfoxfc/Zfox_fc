import { fetchData } from '@/lib/api';
import JoinModal from '@/components/JoinModal';
import NotificationBar from '@/components/Notification';

export default async function Home() {
  const tournaments = await fetchData("Tournaments");

  return (
    <main className="pb-20">
      <NotificationBar />
      
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <h2 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">
          Available <span className="text-orange-600">Matches</span>
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((game) => (
            <div key={game.Game_ID} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                   <div className="bg-orange-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Live</div>
                   <span className="text-slate-500 text-xs">ID: #{game.Game_ID}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{game.Title}</h3>
                <p className="text-orange-400 text-sm font-bold mb-4">Entry: ৳{game.Entry_Fee}</p>
              </div>
              
              <JoinModal game={game} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
    }
            
