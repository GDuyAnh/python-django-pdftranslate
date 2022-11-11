from django.db import models

# Create your models here.
class File(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    status = models.BooleanField(default=False)
    pdf = models.FileField(upload_to='untranFile/')