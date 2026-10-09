from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('recomendador/', views.index, name='index'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('favoritos/', views.favoritos, name='favoritos'),
    path('favoritos/add/<int:api_id>/', views.add_favorito, name='add_favorito'),
    path('favoritos/remove/<int:favorito_id>/', views.remove_favorito, name='remove_favorito'),
]
