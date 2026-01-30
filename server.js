import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(__dirname));

const SHEETDB_URL = "https://sheetdb.io/api/v1/f00uavphvsjh1";

// ১. প্যাকেজ ডাটা ফেচ করা (index.html এর জন্য)
app.get('/api/packages', async (req, res) => {
    try {
        const response = await fetch(`${SHEETDB_URL}?sheet=Packages`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch packages" });
    }
});

// ২. রিয়েল-টাইম ইউজার ডাটা চেক (কয়েন ও মেসেজ)
app.get('/api/user-data', async (req, res) => {
    // নোট: এখানে বর্তমানে হার্ডকোডেড ইমেইল দিচ্ছি, লগইন সিস্টেম তৈরি হলে সেশন থেকে আসবে
    const userEmail = "test@example.com"; 
    try {
        const response = await fetch(`${SHEETDB_URL}/search?email=${userEmail}&sheet=Users`);
        const data = await response.json();
        if (data.length > 0) {
            res.json(data[0]);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ৩. প্যাকেজ জয়েন করার লজিক (রিয়েল-টাইম ভ্যালিডেশন)
app.post('/api/join', async (req, res) => {
    const { packageId } = req.body;
    const userEmail = "test@example.com";

    try {
        // রিয়েল-টাইম চেক: ইউজারের বর্তমান কয়েন এবং অলরেডি জয়েন করেছে কি না
        const userRes = await fetch(`${SHEETDB_URL}/search?email=${userEmail}&sheet=Users`);
        const users = await userRes.json();
        const user = users[0];

        const pkgRes = await fetch(`${SHEETDB_URL}/search?p_id=${packageId}&sheet=Packages`);
        const pkgs = await pkgRes.json();
        const pkg = pkgs[0];

        if (user.joined_packages.includes(packageId)) {
            return res.json({ success: false, message: "Already joined this package!" });
        }

        if (parseInt(user.coins) < parseInt(pkg.price)) {
            return res.json({ success: false, message: "Not enough coins!" });
        }

        // ডাটা আপডেট: কয়েন কমানো এবং প্যাকেজ লিস্টে যোগ করা
        const newCoins = parseInt(user.coins) - parseInt(pkg.price);
        const updatedPackages = user.joined_packages ? `${user.joined_packages},${packageId}` : packageId;

        await fetch(`${SHEETDB_URL}/email/${userEmail}?sheet=Users`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    coins: newCoins,
                    joined_packages: updatedPackages,
                    unread_messages: "True" // ইনবক্সে নোটিফিকেশন ট্রিগার
                }
            })
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Transaction failed" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  
