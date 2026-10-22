# Roadmap 6 tháng

**Khoảng thời gian:** Tháng 11/2026 – Tháng 4/2027  
**Trạng thái:** Đề xuất; điều chỉnh theo thời gian thực tế, phản hồi người dùng và kết quả thử nghiệm.

Roadmap này chuyển định hướng Wikialisa Labs thành các kết quả nhỏ có thể kiểm chứng. Không xem một mốc là hoàn thành chỉ vì đã tạo tài liệu hoặc thư mục; cần có bằng chứng đầu ra được nêu trong từng giai đoạn.

## Tháng 1 — Nền tảng và định vị

- Hoàn thiện README, giới thiệu, nguyên tắc thương hiệu và cấu trúc tài liệu.
- Chọn một nhóm người dùng và vấn đề cụ thể để nghiên cứu.
- Tạo mẫu issue/PR, quy ước nhánh và checklist review.
- Kiểm kê kỹ năng hiện có và xác định phần cần học thêm cho hướng sản phẩm đã chọn.

**Đầu ra:** hồ sơ nhất quán, tài liệu định hướng, backlog ưu tiên và một bản mô tả vấn đề có thể kiểm chứng.

## Tháng 2 — Khám phá sản phẩm

- Phỏng vấn hoặc thu thập phản hồi từ người dùng tiềm năng.
- So sánh tối đa ba ý tưởng theo mức độ hữu ích, khả thi và chi phí duy trì.
- Chọn một ý tưởng để làm nguyên mẫu; ghi lại giả định và tiêu chí thành công.
- Phác thảo luồng người dùng, giao diện và mô hình dữ liệu tối thiểu.

**Đầu ra:** một product brief, giả định có thể kiểm chứng và prototype được đánh giá với người dùng phù hợp.

## Tháng 3 — Nguyên mẫu chạy được

- Xây dựng một luồng người dùng đầu-cuối cho ý tưởng đã chọn.
- Thiết lập cấu hình môi trường an toàn, kiểm thử phù hợp và hướng dẫn chạy cục bộ.
- Nếu có AI, giới hạn vào một tác vụ cụ thể; lập bộ câu hỏi đánh giá chất lượng, độ trễ và chi phí.
- Ghi nhận giới hạn, dữ liệu sử dụng và cách xử lý lỗi.

**Đầu ra:** demo có thể chạy lặp lại, có hướng dẫn và kết quả đánh giá ban đầu.

## Tháng 4 — MVP và phát hành thử

- Chỉ mở rộng prototype khi có tín hiệu sử dụng hoặc phản hồi đủ mạnh.
- Thêm kiểm thử cho các luồng quan trọng, nhật ký lỗi tối thiểu và quy trình phát hành.
- Triển khai bản thử nghiệm trong môi trường phù hợp; không đưa dữ liệu nhạy cảm vào demo.
- Thu thập phản hồi và ưu tiên các vấn đề ảnh hưởng trực tiếp đến người dùng.

**Đầu ra:** MVP thử nghiệm có phạm vi, hướng dẫn sử dụng, giới hạn và kênh phản hồi rõ ràng.

## Tháng 5 — Độ tin cậy và tài liệu

- Xử lý lỗi ưu tiên cao dựa trên phản hồi và dữ liệu vận hành.
- Bổ sung tài liệu kiến trúc, triển khai, khôi phục và quản lý cấu hình.
- Rà soát quyền truy cập, bí mật, dữ liệu lưu trữ và phụ thuộc.
- Viết một case study trung thực về mục tiêu, cách làm và kết quả đo được.

**Đầu ra:** bản phát hành ổn định hơn, checklist vận hành và case study có số liệu hoặc giới hạn được nêu rõ.

## Tháng 6 — Đánh giá và quyết định

- Đánh giá sản phẩm theo tiêu chí đã đặt: mức độ hữu ích, chất lượng, độ tin cậy và chi phí duy trì.
- Quyết định tiếp tục, đổi hướng, duy trì ở mức thử nghiệm hay lưu trữ dự án.
- Công bố portfolio/demo chỉ khi quyền riêng tư, giấy phép và trạng thái đã rõ.
- Lập roadmap tiếp theo dựa trên bằng chứng, không dựa trên số lượng thư mục hoặc tính năng.

**Đầu ra:** quyết định sản phẩm có căn cứ, retrospective và kế hoạch giai đoạn kế tiếp.

## Các luồng chạy xuyên suốt

- **Thương hiệu/nội dung:** cập nhật hồ sơ và chia sẻ bài học sau khi có kết quả thực tế.
- **Kỹ thuật/vận hành:** dùng lint, typecheck, test, build và CI phù hợp với stack thực tế của dự án.
- **AI/safety:** đánh giá chất lượng và chi phí; giới hạn dữ liệu; có cách kiểm tra đầu ra và xử lý lỗi.
- **Quản lý công việc:** GitHub Issues cho backlog; milestones cho các kết quả; review định kỳ hàng tháng.

## Chỉ số theo dõi

Chọn một số chỉ số phù hợp với sản phẩm thay vì đặt mục tiêu số lượng trước khi có dữ liệu:

- Thời gian từ ý tưởng đến prototype có thể đánh giá.
- Tỷ lệ người thử nghiệm hoàn thành luồng chính và phản hồi định tính.
- Tỷ lệ lỗi ở luồng quan trọng, thời gian khắc phục và độ tin cậy triển khai.
- Với tính năng AI: đánh giá chất lượng trên bộ câu hỏi mẫu, độ trễ và chi phí trên mỗi tác vụ.
- Mức độ hoàn chỉnh của hướng dẫn chạy, phát hành và khôi phục.

Không dùng stars, lượt truy cập hay số lượng demo làm đại diện duy nhất cho giá trị sản phẩm.
