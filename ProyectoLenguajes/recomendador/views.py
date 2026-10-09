import requests
import os
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from .models import Favorito
from .processor import filtrar_videojuegos
from .logic import obtener_recomendacion_logica

API_KEY = os.getenv("RAWG_API_KEY")
API_URL = "https://api.rawg.io/api/games"

def fetch_games_from_api(params={}):
    default_params = {"key": API_KEY}
    all_params = {**default_params, **params}
    try:
        response = requests.get(API_URL, params=all_params)
        response.raise_for_status()
        return response.json().get("results", [])
    except requests.RequestException:
        return []

from .models import Profile

def home(request):
    if request.user.is_authenticated:
        try:
            profile = request.user.profile
            games = fetch_games_from_api({
                "page_size": 6,
                "genres": profile.genero_preferido,
                "platforms": profile.plataforma_preferida
            })
        except Profile.DoesNotExist:
            games = fetch_games_from_api({"page_size": 6})
    else:
        games = fetch_games_from_api({"page_size": 6})
    return render(request, "home.html", {"games": games})

def index(request):
    if request.method == "POST":
        nombre = request.POST.get("nombre")
        genero = request.POST.get("genero")
        plataforma = request.POST.get("plataforma")

        search_params = {}
        if nombre:
            search_params["search"] = nombre
        if genero:
            search_params["genres"] = genero
        if plataforma:
            search_params["platforms"] = plataforma

        videojuegos = fetch_games_from_api(search_params)
        
        destacados = obtener_recomendacion_logica(videojuegos)

        if request.user.is_authenticated:
            favoritos_ids = Favorito.objects.filter(user=request.user).values_list('api_id', flat=True)
            for juego in videojuegos:
                juego['es_favorito'] = juego['id'] in favoritos_ids

        return render(request, "resultado.html", {
            "videojuegos": videojuegos,
            "destacados": destacados
        })
    
    return render(request, "index.html")

from .forms import CustomUserCreationForm

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            Profile.objects.create(
                user=user,
                genero_preferido=form.cleaned_data['genero_preferido'],
                plataforma_preferida=form.cleaned_data['plataforma_preferida']
            )
            return redirect('login')
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('home')

@login_required
def add_favorito(request, api_id):
    game_data = fetch_games_from_api({"ids": api_id})
    if game_data:
        game = game_data[0]
        Favorito.objects.get_or_create(
            user=request.user,
            api_id=game['id'],
            defaults={
                'nombre': game['name'],
                'imagen': game['background_image'],
                'rating': game['rating'],
                'genero': ", ".join([g['name'] for g in game['genres']]),
                'plataforma': ", ".join([p['platform']['name'] for p in game['platforms']])
            }
        )
    return redirect('index')

@login_required
def remove_favorito(request, favorito_id):
    Favorito.objects.filter(id=favorito_id, user=request.user).delete()
    return redirect('favoritos')

@login_required
def favoritos(request):
    favoritos = Favorito.objects.filter(user=request.user)
    return render(request, 'favoritos.html', {'favoritos': favoritos})
