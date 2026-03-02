# Hướng dẫn xây dựng báo cáo

Thư mục `docs/` chứa file LaTeX của báo cáo.

## Các tác vụ

1. **Biên dịch PDF**

   ```bash
   cd docs
   xelatex report.tex
   # chạy lại một vài lần nếu cần để cập nhật TOC
   ```

2. **Chuyển sang DOCX** (pandoc yêu cầu hỗ trợ LaTeX và fonts unicode):

   ```bash
   pandoc report.tex -o report.docx --from=latex --toc
   ```

3. **Makefile**

   Nếu muốn sử dụng `make`, chạy lệnh `make` từ thư mục `docs`.

Tài liệu sử dụng `xelatex` để hỗ trợ tiếng Việt với font Unicode. Nếu
phát sinh lỗi về package, cài gói `texlive-xetex`, `texlive-latex-extra`,
`polyglossia` v.v.
