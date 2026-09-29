# 🎀 Tiệm Mốt — PWA MVP

một web game mobile pwa bằng html/css/javascript thuần.

## chạy thử
- giải nén
- chạy bằng một web server local (không mở `index.html` bằng `file://` nếu muốn service worker hoạt động)
- ví dụ: `python3 -m http.server 8080`
- mở `http://localhost:8080`

## host
đưa toàn bộ thư mục lên hosting hỗ trợ https. sau đó người chơi có thể mở bằng safari trên iphone → chia sẻ → thêm vào màn hình chính.

## cấu trúc
- `index.html`: khung ứng dụng
- `styles.css`: giao diện pastel/kawaii responsive
- `game.js`: gameplay, kinh tế, khách, kho, level, nhiệm vụ, nâng cấp, localstorage
- `manifest.webmanifest`: pwa manifest
- `service-worker.js`: cache/offline
- `assets/`: icon app

## lưu game
dữ liệu nằm trong localstorage với key `tiem-mot-v1`.

## mở rộng
kiến trúc dữ liệu đã tách sản phẩm, khách, nâng cấp và state để dễ thêm tầng 3, nhân viên, phòng thử đồ, trang trí, sự kiện, khách vip và bộ sưu tập.
