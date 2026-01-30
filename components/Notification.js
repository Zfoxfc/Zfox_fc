'use client';
import { useEffect, useState } from 'react';

export default function NotificationBar() {
  const [n, setN] = useState([]);
  const [m, setM] = useState(false);

  useEffect(() => {
    setM(true);
    fetch("https://sheetdb.io/api/v1/kn4x6d50pr5dm?sheet=Notifications")
      .then(r => r.json())
      .then(d => {
        if(Array.isArray(d)) setN(d.filter(x => String(x.Is_Read).toLowerCase() === "false"));
      }).catch(() => {});
  }, []);

  if (!m || n.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      {n.map((x, i) => (
        <div key={i} className="bg-orange-500/10 border-l-4 border-orange-500 p-3 text-orange-200 text-sm">📢 {x.Message}</div>
      ))}
    </div>
  );
}
