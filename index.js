const axios = require('axios');

// Cấu hình endpoint hệ thống thương mại điện tử của bạn
const SHOP_API_URL = process.env.SHOP_API_URL || 'https://yourstoredomain.com';
const API_TOKEN = process.env.STORE_API_TOKEN;

async function processOrders() {
    if (!API_TOKEN) {
        console.error("[LỖI] Chưa cấu hình STORE_API_TOKEN trong phần Environment Variables trên Render.");
        return;
    }

    try {
        const headers = {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        };

        console.log("Đang quét danh sách sản phẩm...");
        const response = await axios.get(`${SHOP_API_URL}/v1/products?search=blaze`, { headers });
        const products = response.data;

        if (!products || products.length === 0) {
            console.log("Không tìm thấy sản phẩm nào.");
            return;
        }

        // Tìm sản phẩm có mức giá cao nhất
        const highestPriceItem = products.reduce((max, item) => item.price > max.price ? item : max, products);
        console.log(`Sản phẩm giá cao nhất tìm thấy: ${highestPriceItem.price} USD`);

        // Kiểm tra điều kiện đơn hàng từ 150 USD trở lên
        if (highestPriceItem.price >= 150.00) {
            console.log(`[HỢP LỆ] Mức giá ${highestPriceItem.price} USD đạt điều kiện tối thiểu (>= 150 USD).`);
            
            const orderPayload = {
                product_id: highestPriceItem.id,
                quantity: 1,
                fulfillment_type: "automated"
            };

            const orderResponse = await axios.post(`${SHOP_API_URL}/v1/orders`, orderPayload, { headers });
            if (orderResponse.status === 201 || orderResponse.status === 200) {
                console.log("[THÀNH CÔNG] Đơn hàng tự động đã được ghi nhận.");
            }
        } else {
            console.log(`[BỎ QUA] Mức giá ${highestPriceItem.price} USD chưa đạt điều kiện.`);
        }

    } catch (error) {
        console.error("[LỖI HỆ THỐNG]:", error.message);
    }
}

// Chạy kiểm tra dữ liệu
processOrders();
