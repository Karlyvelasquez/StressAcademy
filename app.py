import pickle
import numpy as np
import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
import traceback

# Cargar variables de entorno
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# Inicializar Flask
app = Flask(__name__)
CORS(app)

# Mapeo de clases
CLASS_LABELS = {0: "Bajo", 1: "Moderado", 2: "Alto"}

# Cargar modelo MLP
try:
    with open("mlp_model.pkl", "rb") as file:
        model = pickle.load(file)
    MODEL_AVAILABLE = True
except:
    model = None
    MODEL_AVAILABLE = False

@app.route("/", methods=["GET", "POST"])
def index():
    prediction = None
    if request.method == "POST" and MODEL_AVAILABLE:
        try:
            inputs = [float(request.form.get(f, 0)) for f in [
                "study_hours", "extracurricular_hours", "sleep_hours",
                "social_hours", "physical_hours", "gpa"
            ]]
            pred_class = model.predict([inputs])[0]
            prediction = CLASS_LABELS.get(pred_class, "Desconocido")
        except Exception as e:
            prediction = f"Error: {e}"
    return render_template("index.html", prediction=prediction)

@app.route("/api/predict", methods=["POST"])
def api_predict():
    if not MODEL_AVAILABLE:
        return jsonify({"error": "Modelo no disponible"}), 503
    try:
        data = request.get_json()
        inputs = [float(data.get(k, 0)) for k in [
            "study_hours", "extracurricular_hours", "sleep_hours",
            "social_hours", "physical_hours", "gpa"
        ]]
        features = np.array([inputs])
        pred_class = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        return jsonify({
            "prediction": CLASS_LABELS.get(pred_class, "Desconocido"),
            "probabilities": {CLASS_LABELS[i]: float(p) for i, p in enumerate(probabilities)},
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "model_error"}), 500

@app.route("/api/generate-feedback", methods=["POST"])
def generate_feedback():
    if not openai_client:
        return jsonify({"error": "OpenAI no configurado"}), 500
    try:
        data = request.get_json()
        personal_data = data.get("personal_data", {})
        stress_level = data.get("stress_level", "Desconocido")
        prompt = f"""
Eres un psicólogo especializado en bienestar estudiantil. Un estudiante obtuvo un nivel de estrés "{stress_level}".

Edad: {personal_data.get('age_range', 'No especificado')}
Carrera: {personal_data.get('career', 'No especificado')}
Semestre: {personal_data.get('academic_level', 'No especificado')}
Ejercicio: {personal_data.get('exercise_habit', 'No especificado')}
Vivienda: {personal_data.get('living_situation', 'No especificado')}
Trabajo: {personal_data.get('work_status', 'No especificado')}
Fuentes de estrés: {personal_data.get('stress_sources', 'No especificado')}

Por favor, proporciona:

1. Saludo amigable y no tan corto

2. **Análisis Personalizado**: Una evaluación específica de su situación considerando todos los factores mencionados.

3. **Recomendaciones Específicas**: Al menos 4 recomendaciones concretas y personalizadas basadas en su perfil, carrera, y circunstancias particulares.

4. **Plan de Acción**: Un plan con actividades que se adapte a sus gustos, y si ves que tiene que disminuir de hacer algo por su bien hazlo.

5. **Recursos Adicionales**: Recursos específicos (apps, técnicas, libros) que serían útiles para su situación particular.

Mantén un tono empático, profesional y motivador. Usa emojis ocasionalmente para hacer el texto más amigable. Estructura la respuesta con títulos claros y listas organizadas.

""" 
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un psicólogo especializado en bienestar estudiantil universitario."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        return jsonify({
            "feedback": response.choices[0].message.content,
            "status": "success"
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e), "status": "openai_error"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy" if MODEL_AVAILABLE else "model_unavailable",
        "openai": bool(openai_client)
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

