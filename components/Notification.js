'use client';
import { useEffect, useState } from 'react';

export default function NotificationBar() {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    fetch("https://sheetdb.io/api/v1/kn4x6d50pr5dm?sheet=Notifications")
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          setNotifs(data.filter(n => String(n.Is_Read).toLowerCase() === "false"));
        }
      });
  }, []);

  if (notifs.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 mt-4">
      {notifs.map((n, i) => (
        <div key={i} className="bg-blue-600/10 border-l-4 border-blue-500 p-3 mb-2 rounded-r-lg">
          <p className="text-sm text-blue-300 font-medium">📢 {n.Message}</p>
        </div>
      ))}
    </div>
  );
    }
    
