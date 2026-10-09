from django.db import models
from django.contrib.auth.models import User


class Favorito(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    api_id = models.IntegerField()
    nombre = models.CharField(max_length=255)
    imagen = models.URLField()
    rating = models.FloatField()
    genero = models.CharField(max_length=255)
    plataforma = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'api_id')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.nombre} - {self.user.username}'

