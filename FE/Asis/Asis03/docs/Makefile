PDFLATEX=xelatex

all: report.pdf

report.pdf: report.tex
	$(PDFLATEX) report.tex
	$(PDFLATEX) report.tex

docx: report.pdf
	pandoc report.tex -o report.docx --from=latex --toc

clean:
	rm -f *.aux *.log *.out *.toc report.pdf report.docx
