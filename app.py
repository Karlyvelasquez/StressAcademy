import pickle
import numpy as np
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()  

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


# Inicializar la app Flask
app = Flask(__name__)

# Habilitar CORS para todas las rutas y orígenes
CORS(app, origins=["*"], methods=["GET", "POST", "OPTIONS"], 
     allow_headers=["Content-Type", "Authorization", "Accept"])

# Mapeo de clases numéricas a etiquetas de texto
CLASS_LABELS = {
    0: "Bajo",
    1: "Moderado", 
    2: "Alto"
}

# Cargar el modelo MLP entrenado
try:
    with open("mlp_model.pkl", "rb") as file:
        model = pickle.load(file)
    print("Modelo MLP cargado exitosamente")
    print("El modelo predice clases numéricas que se convierten a texto")
    MODEL_AVAILABLE = True
except FileNotFoundError:
    print("ERROR CRÍTICO: No se encontró el archivo mlp_model.pkl")
    model = None
    MODEL_AVAILABLE = False
except Exception as e:
    print(f"ERROR CRÍTICO al cargar el modelo: {e}")
    model = None
    MODEL_AVAILABLE = False

# Ruta principal 
@app.route("/", methods=["GET", "POST"])
def index():
    prediction = None
    if request.method == "POST":
        if not MODEL_AVAILABLE:
            prediction = "ERROR: Modelo no disponible"
        else:
            try:
                study = float(request.form["study_hours"])
                extra = float(request.form["extracurricular_hours"])
                sleep = float(request.form["sleep_hours"])
                social = float(request.form["social_hours"])
                physical = float(request.form["physical_hours"])
                gpa = float(request.form["gpa"])

                # Predicción del modelo y conversión a texto
                features = np.array([[study, extra, sleep, social, physical, gpa]])
                pred_class = model.predict(features)[0]  # Número del modelo
                prediction = CLASS_LABELS.get(pred_class, f"Clase desconocida: {pred_class}")
                print(f"Modelo predijo clase {pred_class} → '{prediction}'")

            except Exception as e:
                prediction = f"Error: {e}"

    return render_template("index.html", prediction=prediction)

# API para predicción
@app.route("/api/predict", methods=["POST", "OPTIONS"])
def api_predict():
    # Manejar preflight OPTIONS request
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS, GET")
        return response
    
    # Verificar que el modelo esté disponible ANTES de procesar
    if not MODEL_AVAILABLE or model is None:
        print("PREDICCIÓN RECHAZADA: Modelo no disponible")
        return jsonify({
            "error": "Modelo MLP no disponible. Verifica que mlp_model.pkl esté en el servidor.",
            "status": "model_unavailable",
            "message": "No se pueden realizar predicciones sin el modelo entrenado."
        }), 503  # Service Unavailable
    
    try:
        print("Recibiendo request - Modelo ML con conversión a texto...")
        
        # Obtener datos JSON del request
        data = request.get_json()
        
        if not data:
            print("No se recibieron datos")
            return jsonify({
                "error": "No data provided", 
                "status": "error"
            }), 400
        
        print(f"Datos recibidos: {data}")
        
        # Extraer características 
        study = float(data.get("study_hours", 0))
        extra = float(data.get("extracurricular_hours", 0))
        sleep = float(data.get("sleep_hours", 0))
        social = float(data.get("social_hours", 0))
        physical = float(data.get("physical_hours", 0))
        gpa = float(data.get("gpa", 0))

        print(f"Features para modelo ML: [{study}, {extra}, {sleep}, {social}, {physical}, {gpa}]")

        # PREDICCIÓN DEL MODELO ML
        features = np.array([[study, extra, sleep, social, physical, gpa]])
        print(f"Enviando al modelo ML: {features}")
        
        # EL MODELO PREDICE 
        pred_class = model.predict(features)[0]  # Clase numérica del modelo
        probabilities = model.predict_proba(features)[0]  # Probabilidades del modelo
        
        print(f"Modelo predijo CLASE NUMÉRICA: {pred_class}")
        print(f"Probabilidades del modelo: {probabilities}")

        # CONVERSIÓN DE CLASE NUMÉRICA A ETIQUETA DE TEXTO
        prediction_text = CLASS_LABELS.get(pred_class, f"Clase desconocida: {pred_class}")
        print(f"CONVERSIÓN: Clase {pred_class} → '{prediction_text}'")

        # Crear diccionario de probabilidades con etiquetas de texto
        prob_dict = {CLASS_LABELS[i]: float(prob) for i, prob in enumerate(probabilities)}

        response_data = {
            "prediction": prediction_text,  # Etiqueta de texto
            "probabilities": prob_dict,
            "input_data": {
                "study_hours": study,
                "extracurricular_hours": extra,
                "sleep_hours": sleep,
                "social_hours": social,
                "physical_hours": physical,
                "gpa": gpa
            },
            "model_info": "MLP Neural Network - Predicción con Conversión",
            "raw_prediction_class": int(pred_class),  # Clase numérica original
            "prediction_text": prediction_text,  # Etiqueta de texto
            "status": "success"
        }

        print(f"Respuesta final con conversión: {response_data}")
        
        response = jsonify(response_data)
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response

    except ValueError as e:
        print(f"Error de valor en datos: {e}")
        return jsonify({
            "error": f"Error en los datos proporcionados: {str(e)}",
            "status": "validation_error"
        }), 400
    except Exception as e:
        print(f"Error del modelo ML: {e}")
        return jsonify({
            "error": f"Error en el modelo ML: {str(e)}",
            "status": "model_error"
        }), 500

# Ruta de salud para verificar modelo
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy" if MODEL_AVAILABLE else "model_unavailable",
        "model_loaded": MODEL_AVAILABLE,
        "model_type": "MLP Neural Network - Con Conversión de Clases" if MODEL_AVAILABLE else None,
        "class_labels": CLASS_LABELS if MODEL_AVAILABLE else None,
        "message": "Modelo ML listo - convierte clases numéricas a texto" if MODEL_AVAILABLE else "Modelo ML no disponible"
    })

if __name__ == "__main__":
    
    if MODEL_AVAILABLE:
        print("Modelo ML cargado y listo")
        print("El modelo predice clases numéricas (0, 1, 2)")
        print("Se convierten automáticamente a texto (Bajo, Moderado, Alto)")
        print(f"Mapeo de clases: {CLASS_LABELS}")
    else:
        print("ADVERTENCIA: Modelo ML no disponible")
        print("NO se realizarán predicciones hasta que el modelo esté disponible")
    
    
    app.run(debug=True, host='0.0.0.0', port=5000)
