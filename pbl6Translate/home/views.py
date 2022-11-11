from django.shortcuts import render
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
from .models import File
from django.contrib import messages
from django.contrib.staticfiles.storage import staticfiles_storage
import os
from pdf2docx import Converter
from docx import Document
from googletrans import Translator
from django.conf import settings
# Create your views here.

def index(request):
   return render(request, 'pages/home.html')


def upload_file(request):
    if request.method == "POST":
        title = "title_0"
        name = request.POST['name']
        pdf = request.FILES['file']
        status = False
        file_pdf = File(title=title, name=name, status=status, pdf=pdf)
        file_pdf.save()
        translate('media/untranFile/' + name)
        messages.success(request=request, message='File Upload Successful !!!') 
    else:
        messages.error(request=request, message='File Upload Unsuccessful !!!') 

    return render(request, 'pages/home.html')

def translate(filename):
    Path = os.path.abspath(filename)
    print(Path)
    index1 = Path.__len__()-1 - Path[::-1].index("\\")
    index2 = Path.__len__()-1 - Path[::-1].index(".")
    URL = Path[:index1]
    pdf_file = URL + Path[index1:index2] +  ".pdf"
    docx_file = URL + Path[index1:index2] + ".docx"
    result_file = URL + "\\" + "Rsdocx.docx"
    try:
        # Converting PDF to Docx
        cv_obj = Converter(pdf_file)
        cv_obj.convert(docx_file)
        cv_obj.close()
    except Exception as r:
        print(r)
    else:
        print('File Converted Successfully')
    index = Path.__len__()-1 - Path[::-1].index("\\")
    DocxFiles = docx_file
    document = Document(DocxFiles)
    translate = Translator()
    for paragraph in document.paragraphs:
        if (paragraph.text != ""):
            txt = paragraph.text
            result = translate.translate(txt, dest='vi')
            print(txt, result.text, sep="\n")
            print()
            paragraph.text = result.text
    document.save(result_file)
    os.remove(docx_file)


