# DevOps và phát hành

Các thực hành dưới đây được áp dụng theo mức độ trưởng thành của từng dự án; chúng không mô tả hạ tầng hiện đang chạy.

## Kiểm tra tự động

Khi repo có mã ứng dụng, pipeline nên chạy các lệnh có thể tái hiện tại máy phát triển, ví dụ lint, typecheck, unit/integration tests và build phù hợp với stack.

## Môi trường

Tách cấu hình dev, staging và production khi sản phẩm cần các môi trường đó. Secrets phải nằm trong secret manager hoặc cấu hình bảo mật của nền tảng, không đặt trong repo hay log.

## Phát hành và khôi phục

Mỗi bản phát hành cần có phạm vi, phiên bản, cách xác nhận thành công và cách quay lui phù hợp. Thử nghiệm với dữ liệu giả hoặc dữ liệu được phép sử dụng.

## Giám sát

Theo dõi lỗi và chỉ số cần thiết cho độ tin cậy, quyền riêng tư và chi phí. Không thu thập log vượt quá nhu cầu xử lý sự cố.
