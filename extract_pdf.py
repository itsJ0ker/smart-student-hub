import PyPDF2

pdf_file = open('c:/Users/Joker/Downloads/SMART INDIA HACKATHON (1).pdf', 'rb')
pdf_reader = PyPDF2.PdfReader(pdf_file)
text = ''
for page in pdf_reader.pages:
    text += page.extract_text()
print(text)