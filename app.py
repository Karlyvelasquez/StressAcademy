import pickle
import numpy as np
from flask import Flask, render_template, request

# Inicializar la app Flask
app = Flask(__name__)

label_mapping = {
    0: "Bajo",
    1: "Moderado",
    2: "Alto"
}

# Cargar el modelo MLP entrenado
with open("mlp_model.pkl", "rb") as file:
    model = pickle.load(file)

# Ruta principal con formulario
@app.route("/", methods=["GET", "POST"])
def index():
    prediction = None

    if request.method == "POST":
        try:
            # Obtener los valores del formulario
            study = float(request.form["study_hours"])
            extra = float(request.form["extracurricular_hours"])
            sleep = float(request.form["sleep_hours"])
            social = float(request.form["social_hours"])
            physical = float(request.form["physical_hours"])
            gpa = float(request.form["gpa"])

            # Crear arreglo para predicción
            features = np.array([[study, extra, sleep, social, physical, gpa]])

            # Hacer la predicción
            predicted_class = model.predict(features)[0]
            prediction = label_mapping.get(predicted_class, "Desconocido")


        except ValueError:
            prediction = "Error: Por favor ingresa solo números válidos."

    return render_template("index.html", prediction=prediction)

if __name__ == "__main__":
    app.run(debug=True)
