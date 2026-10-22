# AI, dữ liệu và đánh giá

Tài liệu này là nguyên tắc nền tảng cho các thử nghiệm AI trong tương lai; không khẳng định hiện có hệ thống AI đang vận hành.

## Trước khi chọn mô hình

- Xác định tác vụ, người dùng, dữ liệu đầu vào và tiêu chí thành công.
- Đánh giá phương án không dùng mô hình nếu đơn giản hơn và đủ hiệu quả.
- So sánh chất lượng, độ trễ, chi phí, quyền riêng tư và giới hạn của nhà cung cấp.

## Retrieval và tri thức

Nếu cần RAG, bắt đầu bằng bộ tài liệu được phép sử dụng, ghi nguồn và phiên bản, rồi đánh giá khả năng truy xuất trên câu hỏi mẫu. Chỉ thêm vector store, chunking và metadata filter khi tác vụ chứng minh cần chúng.

## An toàn và riêng tư

- Không gửi secrets hoặc dữ liệu nhạy cảm vào prompt, log hay dịch vụ bên ngoài khi chưa được phép.
- Thu thập lượng dữ liệu tối thiểu; xác định thời hạn lưu và quyền truy cập.
- Xem đầu ra mô hình là không đáng tin cho đến khi được kiểm tra phù hợp với rủi ro.
- Công khai giới hạn và cung cấp cách báo lỗi hoặc yêu cầu con người xem xét khi cần.

## Đánh giá

Dùng bộ câu hỏi đại diện, rubric chất lượng, kiểm tra lỗi nghiêm trọng, latency và chi phí. Lưu kết quả để so sánh thay đổi prompt/mô hình; không chỉ đánh giá bằng vài ví dụ thuận lợi.
