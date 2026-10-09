from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    genero_preferido = models.CharField(max_length=50, choices=[
        ('action', 'Action'),
        ('adventure', 'Adventure'),
        ('role-playing-games-rpg', 'RPG'),
        ('indie', 'Indie'),
        ('shooter', 'Shooter'),
        ('sports', 'Sports'),
        ('strategy', 'Strategy'),
        ('simulation', 'Simulation'),
    ], blank=True, null=True)
    plataforma_preferida = models.CharField(max_length=50, choices=[
        ('4', 'PC'),
        ('187', 'PS5'),
        ('1', 'Xbox One'),
        ('18', 'PS4'),
        ('7', 'Switch'),
        ('3', 'iOS'),
        ('21', 'Android'),
    ], blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} Profile'

