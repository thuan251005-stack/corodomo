# TikTok Growth — Prototype v0.1

Website prototype cá nhân để quản lý số liệu video và theo dõi tăng trưởng View/Follow.

## Chạy thử
1. Giải nén thư mục.
2. Mở `index.html` bằng Chrome hoặc Edge.
3. Website hoạt động trực tiếp, không cần cài Python hay máy chủ.

Có thể chạy local server nếu muốn:
```bash
python -m http.server 8000
```
Sau đó mở `http://localhost:8000`.

## Chức năng
- Dashboard tổng hợp View, Follow, tỷ lệ tương tác.
- Thêm, sửa, xóa video và nhập số liệu thủ công.
- Phân tích Like/View, Comment/View, Share/View, Follow/View.
- Gợi ý nội dung theo chủ đề.
- Lịch kế hoạch nội dung.
- Lưu dữ liệu bằng localStorage trên trình duyệt.
- Xuất/nhập bản sao JSON.
- Giao diện responsive cho điện thoại và máy tính.

## Lưu ý quan trọng
- Dữ liệu hiển thị ban đầu là dữ liệu minh họa, không phải dữ liệu TikTok thật.
- Prototype chưa kết nối TikTok API, chưa đăng nhập TikTok và không tự động đăng video.
- Dữ liệu lưu riêng trên trình duyệt/thiết bị đang dùng. Nếu mở trên thiết bị khác, dữ liệu không tự đồng bộ.
- Không nhập mật khẩu, cookie, mã OTP hoặc thông tin đăng nhập TikTok vào website.
- Các số liệu Follow mới được nhập thủ công; không mặc định TikTok cung cấp số Follow riêng cho từng video.

## Cấu trúc
- `index.html`: cấu trúc giao diện.
- `style.css`: giao diện và responsive.
- `app.js`: dữ liệu mẫu, tính toán, biểu đồ và tương tác.
