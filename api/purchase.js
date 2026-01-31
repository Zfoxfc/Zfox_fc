export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send();

    const { gameId, fee, packageName, userName, matchId } = req.body;
    const SHEETDB_URL = "https://sheetdb.io/api/v1/d6fk2z82ifpco";

    if (!gameId || !fee || !matchId) {
        return res.status(400).json({ message: "প্রয়োজনীয় তথ্য পাওয়া যায়নি!" });
    }

    try {
        // ১. একবারে ইউজার ডাটা, আগের অর্ডার এবং প্যাকেজ ডিটেইলস চেক করা
        const [orderCheckRes, userRes, packageRes] = await Promise.all([
            fetch(`${SHEETDB_URL}/search?sheet=Orders&Game_ID=${gameId}&Match_ID=${matchId}`),
            fetch(`${SHEETDB_URL}/search?sheet=Users&Game_ID=${gameId}`),
            fetch(`${SHEETDB_URL}/search?sheet=Packages&Match_ID=${matchId}`)
        ]);

        const [existingOrders, users, packages] = await Promise.all([
            orderCheckRes.json(),
            userRes.json(),
            packageRes.json()
        ]);

        // ২. ভ্যালিডেশন
        if (existingOrders.length > 0) {
            return res.status(400).json({ message: "আপনি ইতিমধ্যে জয়েন করেছেন! ✅" });
        }
        if (users.length === 0 || packages.length === 0) {
            return res.status(404).json({ message: "ইউজার বা ম্যাচ পাওয়া যায়নি!" });
        }

        const user = users[0];
        const currentPackage = packages[0];
        const currentCoins = parseInt(user.Coins);
        const currentJoined = parseInt(currentPackage.Joined_Players || 0);

        if (currentCoins < fee) {
            return res.status(400).json({ message: "পর্যাপ্ত কয়েন নেই! 🪙" });
        }

        // ৩. আপডেট ডাটা তৈরি
        const newBalance = currentCoins - fee;
        const newJoinedCount = currentJoined + 1;
        const now = new Date();
        const bdTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (3600000 * 6)).toLocaleString('en-GB');

        // ৪. Promise.all দিয়ে সব রিকোয়েস্ট একসাথে পাঠানো (Super Fast)
        const updateTasks = [
            // কয়েন কমানো (Users Sheet)
            fetch(`${SHEETDB_URL}/Game_ID/${gameId}?sheet=Users`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "Coins": newBalance })
            }),
            // জয়েন সংখ্যা বাড়ানো (Packages Sheet)
            fetch(`${SHEETDB_URL}/Match_ID/${matchId}?sheet=Packages`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "Joined_Players": newJoinedCount })
            }),
            // অর্ডার সেভ করা (Orders Sheet)
            fetch(`${SHEETDB_URL}?sheet=Orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "User_Name": userName,
                    "Game_ID": gameId,
                    "Package": packageName,
                    "Match_ID": matchId,
                    "Time": bdTime,
                    "Status": "Success"
                })
            }),
            // ইনবক্স নোটিফিকেশন (Notifications Sheet)
            fetch(`${SHEETDB_URL}?sheet=Notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "Game_ID": gameId,
                    "Message": `সফলভাবে "${packageName}" এ জয়েন করেছেন।`,
                    "Time": bdTime,
                    "Is_Read": "Unseen"
                })
            })
        ];

        // সব কাজ শেষ হওয়া পর্যন্ত অপেক্ষা
        const results = await Promise.all(updateTasks);

        if (results.every(r => r.ok)) {
            return res.status(200).json({ success: true, newBalance: newBalance });
        } else {
            throw new Error("Update Failed");
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "সার্ভার সমস্যা! আবার চেষ্টা করুন।" });
    }
                                     }
