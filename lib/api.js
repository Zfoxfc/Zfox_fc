const API_BASE = "https://sheetdb.io/api/v1/kn4x6d50pr5dm";

export const fetchData = async (sheet) => {
  try {
    const res = await fetch(`${API_BASE}?sheet=${sheet}`, { cache: 'no-store' });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) { return []; }
};

export const postData = async (sheet, payload) => {
  try {
    const res = await fetch(`${API_BASE}?sheet=${sheet}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [payload] }),
    });
    return await res.json();
  } catch (e) { return { error: true }; }
};
