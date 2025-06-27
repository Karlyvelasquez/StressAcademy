// Animated Counter for Statistics
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)
  const timer = setInterval(() => {
    start += increment
    if (start >= target) {
      element.textContent = target
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(start)
    }
  }, 16)
}

// Intersection Observer for Statistics Animation
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = Number.parseFloat(entry.target.dataset.target)
        animateCounter(entry.target, target)
        statsObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.5 },
)

// Observe all stat numbers
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".stat-number[data-target]").forEach((el) => {
    statsObserver.observe(el)
  })
})

// Theme Toggle Functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle")
  const body = document.body
  const themeIcon = themeToggle?.querySelector("i")

  if (!themeToggle || !themeIcon) return

  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem("theme") || "light"
  body.setAttribute("data-theme", currentTheme)
  updateThemeIcon(currentTheme)

  themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    body.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    updateThemeIcon(newTheme)
    updateNavbarBackground()
  })

  function updateThemeIcon(theme) {
    if (theme === "dark") {
      themeIcon.className = "fas fa-sun"
    } else {
      themeIcon.className = "fas fa-moon"
    }
  }

  function updateNavbarBackground() {
    const navbar = document.querySelector(".navbar")
    const theme = body.getAttribute("data-theme")

    if (window.scrollY > 50) {
      navbar.style.background = theme === "dark" ? "rgba(26, 26, 26, 0.98)" : "rgba(255, 248, 220, 0.98)"
    } else {
      navbar.style.background = theme === "dark" ? "rgba(26, 26, 26, 0.95)" : "rgba(255, 248, 220, 0.95)"
    }
  }

  // Navbar Background on Scroll
  window.addEventListener("scroll", () => {
    updateNavbarBackground()
  })
})

// Mobile Navigation
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })
  }
})

// Smooth Scrolling for Navigation Links
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
})

// Team Card Interactions
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".team-card").forEach((card) => {
    const cardGlow = card.querySelector(".card-glow")

    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px)"
      if (cardGlow) cardGlow.style.opacity = "1"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)"
      if (cardGlow) cardGlow.style.opacity = "0"
    })
  })
})

// Intersection Observer for animations
document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".feature-card, .team-card").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
})

// FAQ Chat Functionality
document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chatMessages")

  // FAQ responses database
  const faqResponses = {
    precision: {
      text: "¡Excelente pregunta! 🎯 Nuestro modelo de Machine Learning ha sido entrenado con datos de más de 2,000 estudiantes y tiene una precisión del 97% en la predicción de niveles de estrés académico. Utilizamos un modelo MLP (Multi-Layer Perceptron) que analiza patrones complejos en los datos para hacer predicciones precisas.",
      delay: 2000,
    },
    therapy: {
      text: "No, Jousvex es una herramienta complementaria de apoyo psicoeducativo. 🩺 Si experimentas niveles altos de estrés o ansiedad, siempre recomendamos buscar ayuda profesional de un psicólogo o consejero. Nosotros te ayudamos a identificar patrones, pero el apoyo humano es irreemplazable.",
      delay: 2500,
    },
    frequency: {
      text: "Te recomiendo hacer una evaluación inicial y luego revisiones mensuales para monitorear cambios en tu nivel de estrés. 📅 El asistente conversacional está disponible 24/7 para apoyo continuo. ¡Piensa en ello como un check-up regular para tu bienestar mental!",
      delay: 2200,
    },
    students: {
      text: "¡Sí! 🎓 Nuestro modelo ha sido entrenado con datos de estudiantes de diversas carreras, edades y contextos socioeconómicos. Sin embargo, está específicamente diseñado para estudiantes universitarios. Desde ingeniería hasta arte, ¡todos pueden beneficiarse!",
      delay: 2300,
    },
    created: {
      text: "¡Excelente pregunta! 🗓️ Jousvex fue creada en junio de 2025 en la hermosa ciudad de Cali, Colombia. Nació de Karly Mariana y Carlos Giovanny que experimentaron de primera mano los desafíos del estrés académico y decidieron crear una solución innovadora usando IA. ¡Visión para el cambio!",
      delay: 2500,
    },
    default: {
      text: "Esa es una pregunta muy interesante. 🤔 Te recomiendo que pruebes nuestra herramienta de predicción para obtener una respuesta más personalizada. Si tienes dudas específicas, no dudes en contactar a nuestro equipo.",
      delay: 1800,
    },
  }

  // Add message to chat
  function addMessage(text, isUser = false, delay = 0) {
    if (!chatMessages) return

    setTimeout(() => {
      const messageDiv = document.createElement("div")
      messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`

      const currentTime = new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })

      messageDiv.innerHTML = `
        <div class="message-avatar">
          <i class="fas ${isUser ? "fa-user" : "fa-brain"}"></i>
        </div>
        <div class="message-content">
          <div class="message-bubble">
            ${text}
          </div>
          <div class="message-time">${currentTime}</div>
        </div>
      `

      chatMessages.appendChild(messageDiv)
      chatMessages.scrollTop = chatMessages.scrollHeight

      // Add typing effect for bot messages
      if (!isUser) {
        typeMessage(messageDiv.querySelector(".message-bubble"), text)
      }
    }, delay)
  }

  // Typing effect
  function typeMessage(element, text) {
    if (!element) return
    element.textContent = ""
    let i = 0
    const speed = 30

    function typeChar() {
      if (i < text.length) {
        element.textContent += text.charAt(i)
        i++
        setTimeout(typeChar, speed)
      }
    }

    typeChar()
  }

  // Handle question chips
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Chip clicked:", chip.dataset.question)

      const question = chip.dataset.question
      const questionText = chip.textContent.trim()

      // Add user message
      addMessage(questionText, true)

      // Add bot response
      const response = faqResponses[question] || faqResponses.default

      setTimeout(() => {
        addMessage(response.text, false, 100)
      }, response.delay)

      // Add chip animation
      chip.style.transform = "scale(0.95)"
      setTimeout(() => {
        chip.style.transform = "scale(1)"
      }, 150)
    })
  })
})

// Simplified Prediction Form Functionality
document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const FLASK_API_URL = "http://localhost:5000/api/predict"

  let currentStressLevel = null
  let currentStressData = null

  // Stress level descriptions and recommendations
  const stressData = {
    Bajo: {
      description:
        "Tu nivel de estrés académico es bajo. Mantienes un buen equilibrio entre tus actividades académicas y personales.",
      recommendations: [
        "Continúa manteniendo tus hábitos saludables actuales",
        "Considera ayudar a compañeros que puedan estar experimentando más estrés",
        "Aprovecha este momento para explorar nuevas oportunidades académicas",
        "Mantén una rutina de ejercicio regular",
        "Dedica tiempo a actividades que disfrutes",
      ],
      icon: "fas fa-smile",
      class: "low",
    },
    Moderado: {
      description:
        "Tu nivel de estrés académico es moderado. Es normal experimentar cierto nivel de estrés, pero es importante mantenerlo bajo control.",
      recommendations: [
        "Implementa técnicas de manejo del estrés como meditación o respiración profunda",
        "Organiza mejor tu tiempo con un planificador o agenda",
        "Asegúrate de dormir al menos 7-8 horas por noche",
        "Toma descansos regulares durante el estudio",
        "Busca apoyo de amigos, familia o consejeros académicos",
        "Considera actividades físicas para liberar tensión",
      ],
      icon: "fas fa-meh",
      class: "moderate",
    },
    Alto: {
      description:
        "Tu nivel de estrés académico es alto. Es importante que tomes medidas inmediatas para reducir el estrés y busques apoyo profesional si es necesario.",
      recommendations: [
        "Busca ayuda profesional de un consejero o psicólogo",
        "Revisa y ajusta tu carga académica si es posible",
        "Prioriza el sueño y la alimentación saludable",
        "Practica técnicas de relajación diariamente",
        "Considera reducir actividades extracurriculares temporalmente",
        "Habla con profesores sobre extensiones o apoyo adicional",
        "Conecta con servicios de bienestar estudiantil de tu institución",
      ],
      icon: "fas fa-frown",
      class: "high",
    },
  }

  // Setup slider listeners
  function setupSliderListeners() {
    const sliders = [
      { id: "study_hours", display: "studyValue" },
      { id: "sleep_hours", display: "sleepValue" },
      { id: "extracurricular_hours", display: "extraValue" },
      { id: "social_hours", display: "socialValue" },
      { id: "physical_hours", display: "physicalValue" },
      { id: "gpa", display: "gpaValue" },
    ]

    sliders.forEach(({ id, display }) => {
      const slider = document.getElementById(id)
      const valueDisplay = document.getElementById(display)

      if (slider && valueDisplay) {
        slider.addEventListener("input", (e) => {
          const value = Number.parseFloat(e.target.value).toFixed(1)
          valueDisplay.textContent = value
        })
      }
    })
  }

  // Predict with ML Model
  async function predictWithMLModel(formData) {
    try {
      console.log("Enviando datos al modelo ML:", formData)

      const response = await fetch(FLASK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
        mode: "cors",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error del servidor: ${response.status}`)
      }

      const result = await response.json()
      console.log("Respuesta del modelo ML:", result)

      if (result.status === "success" && result.prediction) {
        return {
          prediction: result.prediction,
          probabilities: result.probabilities,
          modelInfo: result.model_info,
          rawPredictionClass: result.raw_prediction_class,
        }
      } else {
        throw new Error(result.error || "Error en la predicción del modelo ML")
      }
    } catch (error) {
      console.error("Error con modelo ML:", error)
      throw error
    }
  }

  // Display prediction results
  function displayResults(result) {
    const prediction = result.prediction
    const data = stressData[prediction]

    if (!data) {
      console.error("No se encontraron datos para la predicción:", prediction)
      return
    }

    // Store current stress data
    currentStressLevel = prediction
    currentStressData = result

    const resultLevel = document.getElementById("resultLevel")
    const resultDescription = document.getElementById("resultDescription")
    const resultRecommendations = document.getElementById("resultRecommendations")
    const resultIcon = document.getElementById("resultIcon")

    if (resultLevel) {
      resultLevel.textContent = prediction
      resultLevel.className = `result-level ${data.class}`
    }

    if (resultDescription) {
      resultDescription.textContent = data.description
    }

    if (resultIcon) {
      resultIcon.innerHTML = `<i class="${data.icon}"></i>`
    }

    if (resultRecommendations) {
      let probabilitiesHtml = ""

      if (result.probabilities) {
        probabilitiesHtml = `
          <div style="margin: 15px 0; padding: 15px; background: rgba(139, 69, 19, 0.05); border-radius: 12px;">
            <h5 style="margin-bottom: 10px; color: var(--text-primary);">
              <i class="fas fa-chart-pie"></i> Probabilidades del Modelo ML:
            </h5>
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
              ${Object.entries(result.probabilities)
                .map(
                  ([level, prob]) => `
                <div style="text-align: center; flex: 1; min-width: 80px;">
                  <div style="font-weight: 600; color: var(--primary-color);">${level}</div>
                  <div style="font-size: 0.9rem; color: var(--text-muted);">${(prob * 100).toFixed(1)}%</div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        `
      }

      resultRecommendations.innerHTML = `
        <h4>Recomendaciones Generales:</h4>
        <ul>
            ${data.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
        </ul>
        ${probabilitiesHtml}
        <div style="margin-top: 15px; padding: 12px; background: rgba(46, 125, 50, 0.1); border-radius: 8px; font-size: 0.9rem; color: var(--text-muted); border-left: 4px solid #2e7d32;">
          <i class="fas fa-brain"></i> <strong>Modelo:</strong> ${result.modelInfo}
          <br>
          <i class="fas fa-check-circle"></i> Predicción del modelo ML con conversión automática
        </div>
      `
    }

    // Show results container
    const resultsContainer = document.getElementById("resultsContainer")
    if (resultsContainer) {
      resultsContainer.style.display = "block"
      resultsContainer.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle stress prediction
  async function handlePrediction(e) {
    e.preventDefault()

    const predictBtn = document.getElementById("predictBtn")
    if (predictBtn) predictBtn.classList.add("loading")

    // Collect form data
    const formData = {
      study_hours: Number.parseFloat(document.getElementById("study_hours")?.value || 6.0),
      extracurricular_hours: Number.parseFloat(document.getElementById("extracurricular_hours")?.value || 2.5),
      sleep_hours: Number.parseFloat(document.getElementById("sleep_hours")?.value || 7.5),
      social_hours: Number.parseFloat(document.getElementById("social_hours")?.value || 3.5),
      physical_hours: Number.parseFloat(document.getElementById("physical_hours")?.value || 1.0),
      gpa: Number.parseFloat(document.getElementById("gpa")?.value || 3.5),
    }

    try {
      console.log("Iniciando predicción:", formData)
      const result = await predictWithMLModel(formData)
      displayResults(result)
    } catch (error) {
      console.error("Error en predicción:", error)
      alert(`Error en la predicción: ${error.message}`)
    } finally {
      if (predictBtn) predictBtn.classList.remove("loading")
    }
  }

  // Generate AI feedback with OpenAI
  async function generateAIFeedback(personalData) {
    try {
      console.log("🤖 Generando retroalimentación con IA...")

      const prompt = `
Eres un psicólogo especializado en bienestar estudiantil. Un estudiante universitario ha completado una evaluación de estrés académico y ha obtenido un nivel de estrés "${currentStressLevel}".

Información del estudiante:
- Nivel de estrés: ${currentStressLevel}
- Edad: ${personalData.age_range}
- Carrera: ${personalData.career}
- Semestre: ${personalData.academic_level}
- Ejercicio: ${personalData.exercise_habit}
- Hobbies: ${personalData.hobbies}
- Situación de vivienda: ${personalData.living_situation}
- Trabajo: ${personalData.work_status}
- Principales fuentes de estrés: ${personalData.stress_sources}

Datos de hábitos académicos:
- Horas de estudio: ${currentStressData?.input_data?.study_hours || "N/A"} horas/día
- Horas de sueño: ${currentStressData?.input_data?.sleep_hours || "N/A"} horas/noche
- Actividades extracurriculares: ${currentStressData?.input_data?.extracurricular_hours || "N/A"} horas/día
- Tiempo social: ${currentStressData?.input_data?.social_hours || "N/A"} horas/día
- Ejercicio físico: ${currentStressData?.input_data?.physical_hours || "N/A"} horas/día
- GPA: ${currentStressData?.input_data?.gpa || "N/A"}/4.0

Por favor, proporciona:

1. **Análisis Personalizado**: Una evaluación específica de su situación considerando todos los factores mencionados.

2. **Recomendaciones Específicas**: Al menos 5-7 recomendaciones concretas y personalizadas basadas en su perfil, carrera, y circunstancias particulares.

3. **Plan de Acción**: Un plan semanal específico con actividades y horarios sugeridos.

4. **Recursos Adicionales**: Recursos específicos (apps, técnicas, libros) que serían útiles para su situación particular.

Mantén un tono empático, profesional y motivador. Usa emojis ocasionalmente para hacer el texto más amigable. Estructura la respuesta con títulos claros y listas organizadas.
`

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "Eres un psicólogo especializado en bienestar estudiantil universitario. Proporciona consejos empáticos, profesionales y basados en evidencia científica.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `Error de OpenAI: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error(" Error generando feedback con IA:", error)
      throw error
    }
  }

  // Handle feedback form submission
  async function handleFeedbackSubmission(e) {
    e.preventDefault()

    const generateBtn = document.getElementById("generateFeedbackBtn")
    if (generateBtn) generateBtn.classList.add("loading")

    // Show loading message in feedback content area
    const aiFeedbackContent = document.getElementById("aiFeedbackContent")
    const aiFeedbackContainer = document.getElementById("aiFeedbackContainer")

    if (aiFeedbackContainer) {
      aiFeedbackContainer.style.display = "block"
      aiFeedbackContainer.scrollIntoView({ behavior: "smooth" })
    }

    if (aiFeedbackContent) {
      aiFeedbackContent.innerHTML = `
    <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
      <div style="width: 60px; height: 60px; border: 4px solid var(--border-color); border-top: 4px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
      <h4 style="color: var(--primary-color); margin-bottom: 10px;">🤖 Generando tu retroalimentación personalizada...</h4>
      <p style="margin-bottom: 15px;">Nuestro asistente de IA está analizando tu información para crear recomendaciones específicas para tu situación.</p>
      <div style="background: rgba(139, 69, 19, 0.1); border-radius: 12px; padding: 15px; margin-top: 20px;">
        <p style="font-size: 0.9rem; margin: 0; font-style: italic;">
          ⏱️ Esto puede tomar entre 10-30 segundos dependiendo de la complejidad de tu perfil...
        </p>
      </div>
    </div>
  `
    }

    // Collect feedback form data
    const formData = new FormData(e.target)
    const personalData = {
      age_range: formData.get("age_range"),
      career: formData.get("career"),
      academic_level: formData.get("academic_level"),
      exercise_habit: formData.get("exercise_habit"),
      hobbies: formData.get("hobbies"),
      living_situation: formData.get("living_situation"),
      work_status: formData.get("work_status"),
      stress_sources: formData.get("stress_sources"),
    }

    try {
      console.log("🤖 Generando retroalimentación personalizada:", personalData)
      const aiFeedback = await generateAIFeedback(personalData)

      // Display AI feedback
      const aiFeedbackContent = document.getElementById("aiFeedbackContent")
      const aiFeedbackContainer = document.getElementById("aiFeedbackContainer")

      if (aiFeedbackContent) {
        // Convert markdown-like formatting to HTML
        const formattedFeedback = aiFeedback
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/### (.*?)$/gm, "<h4>$1</h4>")
          .replace(/## (.*?)$/gm, "<h3>$1</h3>")
          .replace(/# (.*?)$/gm, "<h2>$1</h2>")
          .replace(/\n\n/g, "</p><p>")
          .replace(/^\d+\.\s/gm, "<li>")
          .replace(/^-\s/gm, "<li>")

        aiFeedbackContent.innerHTML = `<p>${formattedFeedback}</p>`
      }

      if (aiFeedbackContainer) {
        aiFeedbackContainer.style.display = "block"
        aiFeedbackContainer.scrollIntoView({ behavior: "smooth" })
      }

      // Hide feedback form
      const feedbackContainer = document.getElementById("feedbackContainer")
      if (feedbackContainer) {
        feedbackContainer.style.display = "none"
      }
    } catch (error) {
      console.error(" Error generando retroalimentación:", error)

      // Hide loading message on error
      if (aiFeedbackContainer) {
        aiFeedbackContainer.style.display = "none"
      }

      alert(` Error generando retroalimentación personalizada: ${error.message}`)
    } finally {
      if (generateBtn) generateBtn.classList.remove("loading")
    }
  }

  // Show feedback form
  function showFeedbackForm() {
    const feedbackContainer = document.getElementById("feedbackContainer")
    if (feedbackContainer) {
      feedbackContainer.style.display = "block"
      feedbackContainer.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Restart prediction
  function restartPrediction() {
    // Hide all result containers
    const containers = ["resultsContainer", "feedbackContainer", "aiFeedbackContainer"]
    containers.forEach((id) => {
      const container = document.getElementById(id)
      if (container) container.style.display = "none"
    })

    // Reset form values
    const sliders = [
      { id: "study_hours", value: 6.0, display: "studyValue" },
      { id: "sleep_hours", value: 7.5, display: "sleepValue" },
      { id: "extracurricular_hours", value: 2.5, display: "extraValue" },
      { id: "social_hours", value: 3.5, display: "socialValue" },
      { id: "physical_hours", value: 1.0, display: "physicalValue" },
      { id: "gpa", value: 3.5, display: "gpaValue" },
    ]

    sliders.forEach(({ id, value, display }) => {
      const slider = document.getElementById(id)
      const displayElement = document.getElementById(display)

      if (slider) slider.value = value
      if (displayElement) displayElement.textContent = value.toFixed(1)
    })

    // Reset feedback form
    const feedbackForm = document.getElementById("feedbackForm")
    if (feedbackForm) feedbackForm.reset()

    // Reset global variables
    currentStressLevel = null
    currentStressData = null

    // Scroll to form
    const predictionSection = document.getElementById("prediccion")
    if (predictionSection) {
      predictionSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Event Listeners
  const stressForm = document.getElementById("stressForm")
  if (stressForm) {
    stressForm.addEventListener("submit", handlePrediction)
  }

  const feedbackForm = document.getElementById("feedbackForm")
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", handleFeedbackSubmission)
  }

  const getFeedbackBtn = document.getElementById("getFeedbackBtn")
  if (getFeedbackBtn) {
    getFeedbackBtn.addEventListener("click", showFeedbackForm)
  }

  const restartBtn = document.getElementById("restartBtn")
  if (restartBtn) {
    restartBtn.addEventListener("click", restartPrediction)
  }

  const newAnalysisBtn = document.getElementById("newAnalysisBtn")
  if (newAnalysisBtn) {
    newAnalysisBtn.addEventListener("click", restartPrediction)
  }

  // Initialize
  setupSliderListeners()
  console.log(" Jousvex - Formulario simplificado con IA personalizada!")
})