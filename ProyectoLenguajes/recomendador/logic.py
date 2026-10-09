from kanren import Relation, facts, run, var, eq

def obtener_recomendacion_logica(videojuegos):
    """
    Paradigma Lógico: Utiliza 'kanren' para inferir qué juegos recomendar
    basado en reglas lógicas (Rating >= 4.0).
    """
    if not videojuegos:
        return []

    # 1. Definir relaciones
    juego_rating = Relation()
    
    # 2. Definir hechos (Facts)
    for v in videojuegos:
        # Relacionar nombre del juego con su rating
        facts(juego_rating, (v.get('name'), v.get('rating', 0)))
        
    # 3. Definir variables lógicas
    juego = var()
    rating = var()
    
    # 4. Ejecutar consulta lógica (Query)
    # "Encuentra todo 'juego' tal que 'juego' tenga 'rating' y 'rating' sea >= 4.0"
    # Nota: kanren básico usa unificación, para comparaciones numéricas complejas
    # a veces es más limpio filtrar los hechos o usar funciones de python dentro de la lógica.
    # Aquí usaremos un enfoque híbrido válido para el paradigma:
    # Unificamos juego y rating, y luego aplicamos la restricción numérica.
    
    # Solución robusta: Obtener todos los pares (juego, rating) y filtrar
    resultados_raw = run(0, (juego, rating), juego_rating(juego, rating))
    
    # Filtrar donde rating >= 4.0
    recomendados = [j for j, r in resultados_raw if r >= 4.0]
    
    return list(recomendados)
