# Cấu trúc repo

## Hiện trạng

Repo hiện là hồ sơ GitHub cá nhân với tài liệu nền tảng; chưa có ứng dụng hoặc dịch vụ để đặt trong `apps/`, `packages/` hay `services/`. Cấu trúc hiện tại được giữ gọn:

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── README.md
├── docs/
│   ├── README.md
│   ├── architecture/
│   ├── product/
│   ├── roadmap/
│   └── wiki/
└── profile/
    ├── about.md
    ├── achievements.md
    ├── contact.md
    └── skills.md
```

## Định hướng khi có sản phẩm

Chỉ thêm các phần dưới đây khi có dự án thực tế cần chúng. Không tạo package, service, hạ tầng hay dữ liệu mẫu chỉ để lấp đầy sơ đồ.

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   ├── CODEOWNERS
│   └── dependabot.yml
├── apps/                 # Ứng dụng người dùng: web, admin hoặc demo
├── packages/             # Thư viện dùng chung giữa các ứng dụng
├── services/             # API, worker hoặc dịch vụ độc lập
├── infra/                # Cấu hình triển khai thực sự được sử dụng
├── data/                 # Chỉ dữ liệu mẫu công khai, có nguồn và giấy phép
├── templates/            # Mẫu brief, kế hoạch và thiết kế kỹ thuật
├── docs/
│   ├── branding/
│   ├── architecture/
│   ├── product/
│   ├── ai/
│   ├── devops/
│   ├── operations/
│   ├── roadmap/
│   └── playbooks/
└── profile/
```

## Quy tắc thêm thành phần

- Mỗi ứng dụng hoặc dịch vụ cần README riêng, cách chạy, cấu hình cần thiết và chủ sở hữu/bối cảnh rõ ràng.
- Tách `packages/` khi thực sự có mã được dùng chung; tránh tạo lớp trừu tượng trước khi có nhu cầu.
- Không commit secrets, dữ liệu cá nhân, dữ liệu khách hàng hoặc tập dữ liệu không rõ quyền sử dụng.
- Thêm workflow CI/CD khi đã xác định stack, lệnh kiểm tra và môi trường đích; không tạo pipeline giả định.
- Chỉ bật Dependabot cho hệ sinh thái có dependency manifest được theo dõi.
- CODEOWNERS cần phản ánh người review thực tế; cập nhật khi có cộng tác viên hoặc nhóm chịu trách nhiệm.

## Quyết định kiến trúc

Mỗi quyết định ảnh hưởng đáng kể đến stack, dữ liệu, chi phí hoặc vận hành nên được ghi trong một ADR ngắn: bối cảnh, lựa chọn, phương án thay thế, hệ quả và trạng thái.
