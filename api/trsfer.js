export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send();

    const { senderId, receiverId, amount } = req.body;
    const SHEETDB_URL = "https://sheetdb.io/api/v1/kn4x6d50pr5dm";

    if (!senderId || !receiverId || !amount || amount <= 0) {
        return res.status(400).json({ message: "অসম্পূর্ণ তথ্য!" });
    }

    try {
        // ১. প্রেরক (Sender) এর তথ্য যাচাই
        const senderRes = await fetch(`${SHEETDB_URL}/search?Game_ID=${senderId}`);
        const senderData = await senderRes.json();

        if (senderData.length === 0) return res.status(404).json({ message: "আপনার একাউন্ট পাওয়া যায়নি!" });
        
        const senderCurrentCoins = parseInt(senderData[0].Coins);
        if (senderCurrentCoins < amount) return res.status(400).json({ message: "পর্যাপ্ত কয়েন নেই!" });

        // ২. প্রাপক (Receiver) এর আইডি আছে কি না চেক
        const receiverRes = await fetch(`${SHEETDB_URL}/search?Game_ID=${receiverId}`);
        const receiverData = await receiverRes.json();

        if (receiverData.length === 0) return res.status(404).json({ message: "যাকে পাঠাচ্ছেন সেই আইডি পাওয়া যায়নি!" });

        const receiverCurrentCoins = parseInt(receiverData[0].Coins);

        // ৩. প্রেরকের ব্যালেন্স কমানো
        await fetch(`${SHEETDB_URL}/Game_ID/${senderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "Coins": senderCurrentCoins - amount })
        });

        // ৪. প্রাপকের ব্যালেন্স বাড়ানো
        await fetch(`${SHEETDB_URL}/Game_ID/${receiverId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "Coins": receiverCurrentCoins + amount })
        });

        const bdTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

        // ৫. নোটিফিকেশন পাঠানো (প্রাপকের জন্য)
        await fetch(`${SHEETDB_URL}?sheet=Notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "Game_ID": receiverId,
                "Message": `আপনি ${senderId} এর থেকে ${amount} কয়েন পেয়েছেন।`,
                "Time": bdTime,
                "Is_Read": "Unseen"
            })
        });

        return res.status(200).json({ message: "কয়েন সফলভাবে ট্রান্সফার হয়েছে! ✅" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "সার্ভারে সমস্যা হয়েছে!" });
    }
}
