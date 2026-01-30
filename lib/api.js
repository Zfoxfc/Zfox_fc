const API_BASE = "https://sheetdb.io/api/v1/kn4x6d50pr5dm";

export const fetchData = async (sheetName) => {
  try {
    const res = await fetch(`${API_BASE}?sheet=${sheetName}`, {
      next: { revalidate: 10 }, // প্রতি ১০ সেকেন্ড পর ডাটা আপডেট হবে
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};
