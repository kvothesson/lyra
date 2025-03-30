from transcription_analyzer import TranscriptionAnalyzer

def main():
    # Crear una instancia del analizador
    analyzer = TranscriptionAnalyzer()
    
    # URL del video de YouTube a analizar
    video_url = "https://www.youtube.com/watch?v=example"
    
    try:
        # Realizar el análisis completo
        result = analyzer.analyze_video(video_url)
        
        # Imprimir resultados
        print("\n=== Transcripción ===")
        print(result["transcription"])
        
        print("\n=== Análisis ===")
        print(result["analysis"])
        
    except Exception as e:
        print(f"Error durante el análisis: {str(e)}")

if __name__ == "__main__":
    main() 