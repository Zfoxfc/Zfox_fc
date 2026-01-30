'use client';
import { useState } from 'react';

export default function JoinModal({ game }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-xl font-bold transition-all">JOIN MATCH</button>
      {open && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-orange-500 mb-4">{game.Title}</h2>
            <div className="bg-slate-800 p-4 rounded-lg mb-6 text-sm text-slate-300">
              <p><strong>Map:</strong> {game.Map || 'N/A'}</p>
              <p className="mt-2"><strong>Rules:</strong> {game.Rules || 'No hacking allowed.'}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setOpen(false)} className="flex-1 py-2 bg-slate-700 rounded-lg">Close</button>
              <button className="flex-1 py-2 bg-green-600 rounded-lg font-bold">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
    }
        
