from functools import reduce

def filtrar_videojuegos(videojuegos, genero=None, plataforma=None):
    if genero:
        videojuegos = list(filter(lambda v: any(g['name'].lower() == genero.lower() for g in v.get('genres', [])), videojuegos))
    if plataforma:
        videojuegos = list(filter(lambda v: any(p['platform']['name'].lower() == plataforma.lower() for p in v.get('platforms', [])), videojuegos))
    return videojuegos

def calcular_ranking_funcional(videojuegos):
    """
    Paradigma Funcional: Usa map/reduce para calcular métricas o ranking.
    Aquí ordenamos los juegos por rating usando funciones puras.
    """
    if not videojuegos:
        return []
        
    # Ejemplo de uso de map: Extraer tuplas (nombre, rating)
    # datos = list(map(lambda v: (v.get('name'), v.get('rating', 0)), videojuegos))
    
    # Ordenar funcionalmente (crea una nueva lista, no muta la original)
    ranking = sorted(videojuegos, key=lambda v: v.get('rating', 0), reverse=True)
    
    return ranking
