from rest_framework import serializers
from recomendador.models.game import Favorito


class FavoritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorito
        fields = ['id', 'api_id', 'nombre', 'imagen', 'rating', 'genero', 'plataforma', 'created_at']
        read_only_fields = ['id', 'created_at']


class GameSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    background_image = serializers.URLField(allow_null=True)
    rating = serializers.FloatField(allow_null=True)
    genres = serializers.ListField(allow_null=True)
    platforms = serializers.ListField(allow_null=True)
    es_favorito = serializers.BooleanField(default=False, required=False)


class AddFavoritoSerializer(serializers.Serializer):
    api_id = serializers.IntegerField()


class SearchGamesSerializer(serializers.Serializer):
    nombre = serializers.CharField(required=False, allow_blank=True)
    genero = serializers.CharField(required=False, allow_blank=True)
    plataforma = serializers.CharField(required=False, allow_blank=True)
    page = serializers.IntegerField(required=False, min_value=1, default=1)

