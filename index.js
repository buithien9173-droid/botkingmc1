const mineflayer = require('mineflayer');
const express = require('express'); 
const app = express();
const port = process.env.PORT || 10000;

let logList = []; 

// 1. Giao diện Web hiển thị kèo trên điện thoại/máy tính của bạn
app.get('/', (req, res) => {
    let html = `
    <html>
    <head>
        <title>BẢNG SĂN KÈO BLAZE - KINGMC</title>
        <meta charset="utf-8">
        <meta http-equiv="refresh" content="5">
        <style>
            body { font-family: Arial, sans-serif; background: #121212; color: #fff; padding: 20px; }
            h1 { color: #ff9900; text-align: center; }
            .status { text-align: center; font-weight: bold; margin-bottom: 20px; color: #00ff00; }
            .box { background: #1e1e1e; padding: 15px; border-radius: 8px; max-width: 800px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.5); }
            .log-item { border-bottom: 1px solid #333; padding: 10px 0; font-size: 16px; }
            .time { color: #888; font-size: 12px; margin-right: 10px; }
            .highlight { color: #ffcc00; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>🔥 HỆ THỐNG SĂN KÈO BLAZE KINGMC 🔥</h1>
        <div class="status">Trạng thái Bot: ĐANG ONLINE & QUÉT CHỢ 24/24</div>
        <div class="box">
            <h3>Danh sách đơn hàng quét được (Mới nhất ở trên):</h3>
            <div id="logs">
    `;
    
    if (logList.length === 0) {
        html += `<p style="color: #aaa; text-align: center;">Chưa quét được kèo nào. Đang đợi hệ thống /order...</p>`;
    } else {
        logList.forEach(item => {
            html += `<div class="log-item"><span class="time">[${item.time}]</span> <span class="highlight">${item.msg}</span></div>`;
        });
    }
    
    html += `</div></div></body></html>`;
    res.send(html);
});

app.listen(port, () => {
    console.log(`Cổng Web UI đã mở tại port: ${port}`);
});

// 2. Kết nối Bot vào cụm game KingMC
const BOT_OPTIONS = {
    host: 'sgp.kingmc.vn',
    port: 25565,
    username: process.env.MC_USERNAME || 'thianz26',
    version: '1.20.1'
};

const bot = mineflayer.createBot(BOT_OPTIONS);

// TỰ ĐỘNG GÕ LỆNH ĐĂNG NHẬP KHI VÀO SERVER
bot.on('message', (jsonMsg) => {
    const cleanMessage = jsonMsg.toString();
    
    // Nếu hệ thống yêu cầu gõ lệnh /login mật khẩu
    if (cleanMessage.includes('/login') || cleanMessage.includes('đăng nhập') || cleanMessage.includes('/register')) {
        console.log("[HỆ THỐNG] Phát hiện yêu cầu đăng nhập. Đang tự động gõ lệnh...");
        
        // Thay chữ 'MAT_KHAU_CUA_BAN' bằng mật khẩu game thật của nick thianz26
        bot.chat('/login dmthglogacc'); 
    }
});

bot.on('spawn', () => {
    console.log(`[SUCCESS] Bot ${bot.username} đã vào cụm KingSMP.`);
});

bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    // Bộ lọc quét từ khóa Blaze và Order hàng loạt
    if (message.includes('Blaze') && (message.includes('Order') || message.includes('chợ') || message.includes('Market'))) {
        const timeNow = new Date().toLocaleTimeString('vi-VN');
        
        logList.unshift({
            time: timeNow,
            msg: `Người chơi [${username}]: ${message}`
        });

        if (logList.length > 50) logList.pop(); 
        console.log(`[QUÉT ĐƯỢC KÈO]: ${message}`);
    }
});

bot.on('end', () => {
    console.log("Bot mất kết nối, đang tự khởi động lại...");
    setTimeout(() => { process.exit(1); }, 10000);
});
