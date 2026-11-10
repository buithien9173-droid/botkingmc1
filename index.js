const mineflayer = require('mineflayer');

// Cấu hình tài khoản đăng nhập máy chủ KingMC của bạn
const BOT_OPTIONS = {
    host: 'sgp.kingmc.vn', // Địa chỉ IP máy chủ KingMC
    port: 25565,
    username: process.env.MC_USERNAME || 'BotKingSMP', // Lấy tên nhân vật từ Environment trên Render
    version: '1.20.1' // Phiên bản cụm KingSMP yêu cầu
};

console.log("=== HỆ THỐNG KHỞI CHẠY BOT MINECRAFT ===");
console.log(`Đang tiến hành kết nối nhân vật [${BOT_OPTIONS.username}] vào server KingMC...`);

const bot = mineflayer.createBot(BOT_OPTIONS);

// Khi bot đăng nhập thành công vào thế giới game
bot.on('spawn', () => {
    console.log(`[THÀNH CÔNG] Nhân vật ${bot.username} đã online trong cụm KingSMP.`);
    console.log("Bot đang lắng nghe khung chat để quét thông tin đơn hàng Blaze...");
});

// Lắng nghe tất cả tin nhắn xuất hiện trên khung chat của server
bot.on('chat', (username, message) => {
    if (username === bot.username) return; // Bỏ qua tin nhắn của chính bot

    // Bộ lọc kiểm tra nếu tin nhắn chat chứa từ khóa "Blaze" và hệ thống lệnh mua bán
    if (message.includes('Blaze') && (message.includes('Order') || message.includes('chợ') || message.includes('Market'))) {
        console.log(`[PHÁT HIỆN TIN NHẮN CHỢ] Người chơi ${username}: "${message}"`);
        
        // Điều kiện giá trị lọc đặt ra là từ 150$ trở lên
        const TARGET_PRICE = 150;
        console.log(`-> Đang kiểm tra bộ lọc giá trị (Yêu cầu đơn hàng >= ${TARGET_PRICE}$)`);
        
        // Thêm lệnh xử lý tự động của bạn tại đây
        // Ví dụ gõ lệnh trong game: bot.chat('/order buy blaze...');
    }
});

bot.on('error', (err) => {
    console.error("[LỖI KẾT NỐI] Gặp sự cố mạng:", err.message);
});

bot.on('end', () => {
    console.log("[NGẮT KẾT NỐI] Bot đã rời khỏi server. Đang khởi động lại sau 15 giây...");
    setTimeout(() => { process.exit(1); }, 15000); // Lệnh này giúp Render tự khởi chạy lại bot ngay lập tức
});
