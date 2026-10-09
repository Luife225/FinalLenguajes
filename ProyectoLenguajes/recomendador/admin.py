from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from recomendador.models import Profile, Favorito


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'genero_preferido', 'plataforma_preferida']
    search_fields = ['user__username', 'user__email']
    list_filter = ['genero_preferido', 'plataforma_preferida']


@admin.register(Favorito)
class FavoritoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'user', 'api_id', 'rating', 'created_at']
    search_fields = ['nombre', 'user__username']
    list_filter = ['created_at', 'rating', 'genero']
    readonly_fields = ['created_at']
