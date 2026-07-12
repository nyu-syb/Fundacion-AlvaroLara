if (!localStorage.getItem('usuarioActivo')) {
  window.location.replace('formulario.html');
}

const bancoRetos = Array.isArray(window.RETOS)
  ? window.RETOS
  : window.RETOS?.RETOS;

const preguntas = Array.isArray(bancoRetos)
  ? [...bancoRetos].sort(() => Math.random() - 0.5).slice(0, 10)
  : [];

const pregunta = document.getElementById('question');
const answers = document.getElementById('answers');
const nextButton = document.getElementById('nextBtn');
const quizContainer = document.getElementById('quiz-container');
const resultado = document.getElementById('resultado');

let indice = 0;
let correctas = 0;
let respuestas = [];
let respondida = false;

function mostrarPregunta() {
  const reto = preguntas[indice];

  if (!reto) {
    terminar();
    return;
  }

  respondida = false;
  pregunta.textContent = `${indice + 1}. ${reto.pregunta}`;
  answers.innerHTML = '';
  nextButton.disabled = true;
  nextButton.textContent = indice === preguntas.length - 1 ? 'Ver resultado' : 'Siguiente';

  reto.opciones.forEach((opcion) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = opcion;
    boton.className = 'option';
    boton.addEventListener('click', () => seleccionarRespuesta(reto, opcion, boton));
    answers.appendChild(boton);
  });
}

function seleccionarRespuesta(reto, opcion, botonSeleccionado) {
  if (respondida) return;
  respondida = true;

  const esCorrecta = opcion === reto.respuesta;
  respuestas.push({
    pregunta: reto.pregunta,
    correcta: reto.respuesta,
    usuario: opcion,
    explicacion: reto.explicacion,
    esCorrecta
  });

  if (esCorrecta) correctas += 1;

  [...answers.querySelectorAll('.option')].forEach((boton) => {
    boton.disabled = true;
    if (boton.textContent === reto.respuesta) boton.classList.add('correcta');
  });

  if (!esCorrecta) botonSeleccionado.classList.add('incorrecta');
  nextButton.disabled = false;
}

function terminar() {
  quizContainer.style.display = 'none';
  resultado.style.display = 'block';
  document.getElementById('score').textContent = `${correctas} de ${preguntas.length}`;

  const revision = respuestas.map((respuesta) => `
    <article class="error-card">
      <h4>${respuesta.pregunta}</h4>
      <p>Tu respuesta: <b>${respuesta.usuario}</b></p>
      <p>Respuesta correcta: <b>${respuesta.correcta}</b></p>
      <p>${respuesta.explicacion}</p>
    </article>
  `).join('');

  document.getElementById('review').innerHTML = revision;
  guardarRetoCompletado();
}

function guardarRetoCompletado() {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
  const usuarios = JSON.parse(localStorage.getItem('usuariosFundacion')) || [];
  if (!usuarioActivo) return;

  const indiceUsuario = usuarios.findIndex((usuario) =>
    usuario.email.toLowerCase() === usuarioActivo.email.toLowerCase()
  );
  if (indiceUsuario < 0) return;

  const usuario = usuarios[indiceUsuario];
  usuario.retosCompletados = Array.isArray(usuario.retosCompletados) ? usuario.retosCompletados : [];
  const fecha = new Date().toLocaleDateString('es-CO');

  if (!usuario.retosCompletados.some((reto) => reto.fecha === fecha)) {
    usuario.retosCompletados.push({ fecha, correctas, total: preguntas.length });
    usuarios[indiceUsuario] = usuario;
    localStorage.setItem('usuariosFundacion', JSON.stringify(usuarios));
    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
  }
}

nextButton.addEventListener('click', () => {
  if (!respondida) return;

  indice += 1;
  if (indice < preguntas.length) {
    mostrarPregunta();
  } else {
    terminar();
  }
});

if (preguntas.length) {
  mostrarPregunta();
} else {
  pregunta.textContent = 'No se pudieron cargar los retos. Recarga la página e inténtalo de nuevo.';
  nextButton.hidden = true;
}