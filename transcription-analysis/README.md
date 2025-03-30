# Analizador de Transcripciones de YouTube

Este módulo permite analizar videos de YouTube mediante la obtención de subtítulos, transcripción y análisis usando IA.

## Requisitos

- Python 3.8 o superior
- FFmpeg instalado en el sistema
- API key de Groq

## Instalación

1. Instalar las dependencias:
```bash
pip install -r requirements.txt
```

2. Configurar las variables de entorno:
Crear un archivo `.env` en la carpeta `transcription-analysis` con:
```
GROQ_API_KEY=tu_api_key_aquí
```

## Uso

```python
from transcription_analyzer import TranscriptionAnalyzer

# Crear una instancia del analizador
analyzer = TranscriptionAnalyzer()

# Analizar un video
result = analyzer.analyze_video("https://www.youtube.com/watch?v=example")

# Acceder a los resultados
print(result["transcription"])  # Transcripción del video
print(result["analysis"])       # Análisis generado por Groq
```

## Funcionalidades

- Obtención automática de subtítulos de YouTube (si están disponibles)
- Descarga y transcripción de videos usando Whisper
- Análisis de contenido usando Groq
- Soporte para videos en español e inglés

## Notas

- El modelo de Whisper utilizado es el "base". Para mejor precisión, puedes cambiar a "medium" o "large" en el constructor de TranscriptionAnalyzer
- Se requiere una conexión a internet para el funcionamiento
- Los archivos de audio temporales se eliminan automáticamente después de la transcripción 