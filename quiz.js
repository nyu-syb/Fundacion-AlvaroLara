if (!localStorage.getItem('usuarioActivo')) {
  window.location.replace('formulario.html');
}

const params = new URLSearchParams(window.location.search);
const materia = params.get('materia') || 'matematicas';
const meta = window.getQuizMeta(materia);
const preguntas = window.getQuizQuestions(materia);

const intro = document.getElementById('quiz-intro');
const container = document.getElementById('quiz-container');
const results = document.getElementById('quiz-results');
const startButton = document.getElementById('start-quiz');
const title = document.getElementById('quiz-title');
const description = document.getElementById('quiz-description');
const questionCounter = document.getElementById('question-counter');
const subjectLabel = document.getElementById('subject-label');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const nextButton = document.getElementById('next-question');
const progressBar = document.getElementById('progress-bar');
const scoreSummary = document.getElementById('score-summary');
const correctCount = document.getElementById('correct-count');
const wrongCount = document.getElementById('wrong-count');
const percentCount = document.getElementById('percent-count');
const wrongList = document.getElementById('wrong-list');

let indiceActual = 0;
let respuestasSeleccionadas = [];
let resultadoGuardado = false;

function guardarResultadoEnPerfil(resultado) {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
  const usuarios = JSON.parse(localStorage.getItem('usuariosFundacion')) || [];
  if (!usuarioActivo) return;

  const indiceUsuario = usuarios.findIndex((usuario) =>
    usuario.email.toLowerCase() === usuarioActivo.email.toLowerCase()
  );
  if (indiceUsuario < 0) return;

  const usuario = usuarios[indiceUsuario];
  usuario.puntajes = Array.isArray(usuario.puntajes) ? usuario.puntajes : [];
  usuario.puntajes.push(resultado);
  usuario.promedio = Math.round(usuario.puntajes.reduce((total, item) => total + item.porcentaje, 0) / usuario.puntajes.length);
  usuario.mejorPuntaje = Math.max(...usuario.puntajes.map((item) => item.porcentaje));
  usuarios[indiceUsuario] = usuario;
  localStorage.setItem('usuariosFundacion', JSON.stringify(usuarios));
  localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
}

function inicializarQuiz() {
  title.textContent = `Test de ${meta.label}`;
  description.textContent = meta.description;
  subjectLabel.textContent = meta.label;
  questionCounter.textContent = `Pregunta 1 de ${preguntas.length}`;
  progressBar.style.width = '0%';
}

function renderPregunta() {
  const pregunta = preguntas[indiceActual];
  questionText.textContent = `${indiceActual + 1}. ${pregunta.pregunta}`;
  questionCounter.textContent = `Pregunta ${indiceActual + 1} de ${preguntas.length}`;
  optionsList.innerHTML = '';

  pregunta.opciones.forEach((opcion, index) => {
    const label = document.createElement('label');
    label.className = 'option-item';
    label.innerHTML = `
      <input type="radio" name="respuesta" value="${opcion}" />
      <span>${opcion}</span>
    `;

    const input = label.querySelector('input');
    const saved = respuestasSeleccionadas[indiceActual];
    if (saved === opcion) {
      input.checked = true;
    }

    input.addEventListener('change', () => {
      respuestasSeleccionadas[indiceActual] = opcion;
    });

    optionsList.appendChild(label);
  });

  progressBar.style.width = `${((indiceActual + 1) / preguntas.length) * 100}%`;
}

function mostrarResultados() {
  const correctas = respuestasSeleccionadas.reduce((acc, respuesta, index) => {
    return acc + (respuesta === preguntas[index].respuesta ? 1 : 0);
  }, 0);
  const incorrectas = preguntas.length - correctas;
  const porcentaje = Math.round((correctas / preguntas.length) * 100);

  scoreSummary.textContent = `Lograste ${correctas} respuestas correctas de ${preguntas.length}.`;
  correctCount.textContent = correctas;
  wrongCount.textContent = incorrectas;
  percentCount.textContent = `${porcentaje}%`;
  if (!resultadoGuardado) {
    guardarResultadoEnPerfil({
      materia: meta.label,
      correctas,
      incorrectas,
      porcentaje,
      fecha: new Date().toLocaleDateString('es-CO')
    });
    resultadoGuardado = true;
  }

  const errores = preguntas.reduce((acc, pregunta, index) => {
    const seleccionada = respuestasSeleccionadas[index];
    if (seleccionada && seleccionada !== pregunta.respuesta) {
      acc.push({
        pregunta: pregunta.pregunta,
        respuestaCorrecta: pregunta.respuesta,
        respuestaSeleccionada: seleccionada,
        explicacion: pregunta.explicacion
      });
    }
    return acc;
  }, []);

  if (errores.length === 0) {
    wrongList.innerHTML = '<p class="success-message">¡Excelente! No tienes errores en este simulacro.</p>';
  } else {
    wrongList.innerHTML = '<h4>En estas preguntas te equivocaste:</h4>' + errores.map((error) => `
      <article class="error-card">
        <p><strong>${error.pregunta}</strong></p>
        <p>Tu respuesta: <span class="wrong-answer">${error.respuestaSeleccionada}</span></p>
        <p>Respuesta correcta: <span class="correct-answer">${error.respuestaCorrecta}</span></p>
        <p class="explanation">${error.explicacion}</p>
      </article>
    `).join('');
  }

  intro.classList.add('hidden');
  container.classList.add('hidden');
  results.classList.remove('hidden');
}

startButton.addEventListener('click', () => {
  intro.classList.add('hidden');
  container.classList.remove('hidden');
  renderPregunta();
});

nextButton.addEventListener('click', () => {
  if (!respuestasSeleccionadas[indiceActual]) {
    alert('Selecciona una opción para continuar.');
    return;
  }

  if (indiceActual < preguntas.length - 1) {
    indiceActual += 1;
    renderPregunta();
  } else {
    mostrarResultados();
  }
});

inicializarQuiz();
