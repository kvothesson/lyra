import os
import yt_dlp
import whisper
import groq
from dotenv import load_dotenv
from typing import Optional, Dict, Any
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import parse_qs, urlparse

class TranscriptionAnalyzer:
    def __init__(self):
        load_dotenv()
        self.groq_client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.whisper_model = whisper.load_model("base")
        self.subtitles_dir = "subtitles"
        
        # Crear directorio base para subtítulos si no existe
        if not os.path.exists(self.subtitles_dir):
            os.makedirs(self.subtitles_dir)
        
    def get_video_id(self, video_url: str) -> str:
        """Extrae el ID del video de una URL de YouTube."""
        parsed_url = urlparse(video_url)
        if parsed_url.hostname == 'youtu.be':
            return parsed_url.path[1:]
        if parsed_url.hostname in ('www.youtube.com', 'youtube.com'):
            if parsed_url.path == '/watch':
                return parse_qs(parsed_url.query)['v'][0]
            if parsed_url.path[:7] == '/embed/':
                return parsed_url.path.split('/')[2]
        raise ValueError("URL de YouTube no válida")

    def get_youtube_subtitles(self, video_url: str) -> Optional[str]:
        """Intenta obtener los subtítulos disponibles del video de YouTube."""
        try:
            video_id = self.get_video_id(video_url)
            
            # Crear directorio específico para este video
            video_dir = os.path.join(self.subtitles_dir, video_id)
            if not os.path.exists(video_dir):
                os.makedirs(video_dir)
            
            # Verificar si ya tenemos los subtítulos guardados
            subtitles_file = os.path.join(video_dir, "subtitles.txt")
            if os.path.exists(subtitles_file):
                with open(subtitles_file, 'r', encoding='utf-8') as f:
                    return f.read()
            
            # Obtener la transcripción
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['es', 'en'])
            
            # Convertir la transcripción en texto
            subtitles_text = ""
            for entry in transcript:
                subtitles_text += entry['text'] + "\n"
            
            # Guardar los subtítulos
            with open(subtitles_file, 'w', encoding='utf-8') as f:
                f.write(subtitles_text)
            
            return subtitles_text
            
        except Exception as e:
            print(f"Error al obtener subtítulos: {str(e)}")
            return None

    def transcribe_video(self, video_url: str) -> str:
        """Transcribe el video usando Whisper si no hay subtítulos disponibles."""
        # Primero intentar obtener subtítulos existentes
        subtitles = self.get_youtube_subtitles(video_url)
        if subtitles:
            return subtitles
            
        # Si no hay subtítulos, descargar y transcribir el video
        video_id = self.get_video_id(video_url)
        video_dir = os.path.join(self.subtitles_dir, video_id)
        
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            audio_path = os.path.join(video_dir, f"{info['id']}.mp3")
            
        # Transcribir con Whisper
        result = self.whisper_model.transcribe(audio_path)
        
        # Guardar la transcripción
        transcription_file = os.path.join(video_dir, "transcription.txt")
        with open(transcription_file, 'w', encoding='utf-8') as f:
            f.write(result["text"])
        
        # Limpiar archivo temporal
        os.remove(audio_path)
        
        return result["text"]

    def analyze_transcription(self, transcription: str) -> Dict[str, Any]:
        """Analiza la transcripción usando Groq."""
        prompt = f"""
        Analiza la siguiente transcripción y proporciona:
        1. Resumen principal
        2. Puntos clave
        3. Temas principales
        4. Conclusiones importantes
        
        Transcripción:
        {transcription}
        """
        
        completion = self.groq_client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "system", "content": """
Actúa como un agente de IA de alto rendimiento, especializado en analizar y sintetizar transcripciones de sesiones parlamentarias. 
Tu tarea es procesar la transcripción completa de la sesión de la Cámara de Diputados y transformar la información en un resumen claro y directo. 
Debes identificar y resaltar los puntos críticos, las decisiones clave y cualquier tendencia relevante.
Además, produce una lista de sugerencias óptimas y concisas para próximos pasos, basadas en el contenido, que puedan servir de guía para la toma de decisiones. 

Asegúrate de:
- Presentar un resumen breve y preciso.
- Listar los principales eventos o decisiones en formato de viñetas.
- Incluir recomendaciones accionables y pertinentes.
- Realizar un análisis de la retórica y la dinámica de la sesión si es relevante.

Tu respuesta debe ser útil, procesable y sin redundancias. Este output será el núcleo funcional de 'Lyra', una IA que convierte datos crudos en conocimiento valioso.

--- TRANSCRIPCIÓN DE LA SESIÓN ---

"""},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        return {
            "analysis": completion.choices[0].message.content,
            "transcription": transcription
        }

    def analyze_video(self, video_url: str) -> Dict[str, Any]:
        """Proceso completo de análisis de video."""
        # Obtener transcripción
        transcription = self.transcribe_video(video_url)
        
        # Analizar transcripción
        analysis = self.analyze_transcription(transcription)
        
        return analysis 