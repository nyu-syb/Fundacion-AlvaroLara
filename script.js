/* =========================
   CARRUSEL HERO
========================= */

const slides = document.querySelectorAll(".hero-slider img");
const btnPrev = document.querySelector(".hero-control.prev");
const btnNext = document.querySelector(".hero-control.next");

if (slides.length > 0) {
    let slideActual = 0;
    let intervaloHero;

    function mostrarSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));

        if (index >= slides.length) {
            slideActual = 0;
        } else if (index < 0) {
            slideActual = slides.length - 1;
        } else {
            slideActual = index;
        }

        slides[slideActual].classList.add("active");
    }

    function cambiarSlide() {
        mostrarSlide(slideActual + 1);
    }

    function iniciarIntervalo() {
        clearInterval(intervaloHero);
        intervaloHero = setInterval(cambiarSlide, 4000);
    }

    btnPrev?.addEventListener("click", () => {
        mostrarSlide(slideActual - 1);
        iniciarIntervalo();
    });

    btnNext?.addEventListener("click", () => {
        mostrarSlide(slideActual + 1);
        iniciarIntervalo();
    });

    mostrarSlide(0);
    iniciarIntervalo();
}


/* =========================
   CONTADORES ANIMADOS
========================= */

const contadores = document.querySelectorAll(".contador");

const iniciarContadores = () => {

    contadores.forEach(contador => {

        const objetivo = +contador.getAttribute("data-target");

        let valor = 0;

        const incremento = objetivo / 100;

        const actualizar = () => {

            if (valor < objetivo) {

                valor += incremento;

                contador.innerText = Math.ceil(valor);

                setTimeout(actualizar, 20);

            } else {

                contador.innerText = objetivo;

            }

        };

        actualizar();

    });

};

let contadoresIniciados = false;

window.addEventListener("scroll", () => {

    const seccion = document.querySelector(".estadisticas");

    if (!seccion) return;

    const posicion = seccion.getBoundingClientRect().top;

    const pantalla = window.innerHeight;

    if (posicion < pantalla && !contadoresIniciados) {

        iniciarContadores();

        contadoresIniciados = true;

    }

});


/* =========================
   ANIMACIONES AL SCROLL
========================= */

const elementos = document.querySelectorAll(
`
.programa-card,
.paso,
.ventaja,
.resultado-card,
.testimonio,
.imagen-nosotros
`
);

const mostrarElementos = () => {

    elementos.forEach(elemento => {

        const posicion = elemento.getBoundingClientRect().top;

        if (posicion < window.innerHeight - 100) {

            elemento.style.opacity = "1";

            elemento.style.transform = "translateY(0)";

        }

    });

};

elementos.forEach(elemento => {

    elemento.style.opacity = "0";

    elemento.style.transform = "translateY(40px)";

    elemento.style.transition = ".8s";

});

window.addEventListener("scroll", mostrarElementos);

mostrarElementos();


/* =========================
   NAVBAR SCROLL
========================= */

window.addEventListener("scroll", () => {

    const header = document.querySelector("header");

    if (window.scrollY > 50) {

        header.style.padding = "10px 8%";

        header.style.boxShadow =
        "0 5px 15px rgba(0,0,0,.1)";

    } else {

        header.style.padding = "15px 8%";

        header.style.boxShadow =
        "0 2px 15px rgba(0,0,0,.08)";

    }

});


/* =========================
   SCROLL SUAVE MENÚ
========================= */

document.querySelectorAll('a[href^="#"]').forEach(enlace => {

    enlace.addEventListener("click", function(e) {

        e.preventDefault();

        const destino =
        document.querySelector(this.getAttribute("href"));

        if (destino) {

            destino.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

const formulario = document.getElementById("form-contacto");

if (formulario) {
    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        const datos = new FormData(formulario);
        const nombre = datos.get("nombre") || "";
        const email = datos.get("email") || "";
        const telefono = datos.get("telefono") || "";
        const municipio = datos.get("municipio") || "";
        const mensaje = datos.get("mensaje") || "";

        const texto = `Hola, quiero información sobre la fundación.\nNombre: ${nombre}\nCorreo: ${email}\nTeléfono: ${telefono}\nMunicipio: ${municipio}\nMensaje: ${mensaje}`;

        const url = `https://wa.me/573219371513?text=${encodeURIComponent(texto)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        formulario.reset();
    });
}

const formularioRegistro = document.getElementById("form-registro");
const panelUsuario = document.getElementById("panel-usuario");
const mensajeRegistro = document.getElementById("mensaje-registro");
const bienvenida = document.getElementById("bienvenida");
const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
const formularioLogin = document.getElementById("form-login");
const mensajeLogin = document.getElementById("mensaje-login");
const btnCerrarSesionPanel = document.getElementById("btn-cerrar-sesion-panel");
const usuarioNombrePanel = document.getElementById("usuario-nombre");
const usuarioFechaPanel = document.getElementById("usuario-fecha");
const usuarioPromedioPanel = document.getElementById("usuario-promedio");
const usuarioSimulacrosPanel = document.getElementById("usuario-simulacros");
const usuarioMejorPanel = document.getElementById("usuario-mejor");
const usuarioRetosPanel = document.getElementById("usuario-retos");

const STORAGE_KEY_USUARIOS = "usuariosFundacion";
const STORAGE_KEY_USUARIO_ACTIVO = "usuarioActivo";

function getUsuarios() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_USUARIOS)) || [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuarios));
}

function getUsuarioActivo() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_USUARIO_ACTIVO));
}

function guardarUsuarioActivo(usuario) {
    localStorage.setItem(STORAGE_KEY_USUARIO_ACTIVO, JSON.stringify(usuario));
}

function actualizarUsuarioEnListado(usuario) {
    const usuarios = getUsuarios();
    const index = usuarios.findIndex(u => u.email.toLowerCase() === usuario.email.toLowerCase());

    if (index >= 0) {
        usuarios[index] = usuario;
        guardarUsuarios(usuarios);
    }
}

function calcularEstadisticas(usuario) {
    const puntajes = usuario.puntajes || [];
    const simulacros = puntajes.length;
    const promedio = simulacros > 0
        ? Math.round(puntajes.reduce((total, item) => total + (item.porcentaje || 0), 0) / simulacros)
        : 0;
    const mejorPuntaje = puntajes.reduce((max, item) => Math.max(max, item.porcentaje || 0), 0);

    return {
        promedio,
        simulacros,
        mejorPuntaje
    };
}

function renderUsuarioPanel(usuario) {
    if (!usuario) return;

    if (bienvenida) {
        bienvenida.textContent = `Hola, ${usuario.nombre}`;
    }

    if (usuarioNombrePanel) {
        usuarioNombrePanel.textContent = `Hola ${usuario.nombre} 👋`;
    }

    if (usuarioFechaPanel) {
        usuarioFechaPanel.textContent = usuario.fechaRegistro || "--";
    }

    const datos = calcularEstadisticas(usuario);

    if (usuarioPromedioPanel) {
        usuarioPromedioPanel.textContent = `${datos.promedio}%`;
    }

    if (usuarioSimulacrosPanel) {
        usuarioSimulacrosPanel.textContent = datos.simulacros;
    }

    if (usuarioMejorPanel) {
        usuarioMejorPanel.textContent = `${datos.mejorPuntaje}%`;
    }

    if (usuarioRetosPanel) {
        usuarioRetosPanel.textContent = (usuario.retosCompletados || []).length;
    }

    const listaPuntajes = document.getElementById("lista-puntajes");
    if (listaPuntajes) {
        const historial = usuario.puntajes || [];

        if (historial.length === 0) {
            listaPuntajes.innerHTML = "<p>Aún no has realizado ningún simulacro.</p>";
        } else {
            listaPuntajes.innerHTML = historial.slice().reverse().map(item => `
                <div class="puntaje-item">
                    <strong>${item.materia}</strong><br>
                    ✔ ${item.correctas} / 20<br>
                    📈 ${item.porcentaje}%<br>
                    <small>${item.fecha}</small>
                </div>
            `).join("");
        }
    }
}

function cerrarSesion() {
    localStorage.removeItem(STORAGE_KEY_USUARIO_ACTIVO);
    window.location.href = "formulario.html";
}

function limpiarErrorCampo(campo) {
    const input = formularioRegistro?.elements[campo];
    const errorElemento = document.querySelector(`[data-error-for="${campo}"]`);

    if (input) {
        input.classList.remove("input-error");
    }

    if (errorElemento) {
        errorElemento.textContent = "";
    }
}

function mostrarErrorCampo(campo, mensaje) {
    const input = formularioRegistro?.elements[campo];
    const errorElemento = document.querySelector(`[data-error-for="${campo}"]`);

    if (input) {
        input.classList.add("input-error");
    }

    if (errorElemento) {
        errorElemento.textContent = mensaje;
    }
}

function validarCampo(campo, valor) {
    const texto = valor.trim();

    switch (campo) {
        case "nombre":
            return texto ? "" : "Ingresa tu nombre completo.";
        case "email":
            if (!texto) return "Ingresa tu correo electrónico.";
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto) ? "" : "Ingresa un correo válido.";
        case "telefono":
            return /^\d{7,15}$/.test(texto.replace(/[\s-]/g, "")) ? "" : "Ingresa un teléfono válido.";
        case "municipio":
            return texto ? "" : "Ingresa tu municipio.";
        case "password":
            if (!texto) return "Crea una contraseña.";
            if (texto.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
            return "";
        default:
            return "";
    }
}

function validarFormularioRegistro() {
    let valido = true;

    ["nombre", "email", "telefono", "municipio", "password"].forEach(campo => {
        const input = formularioRegistro?.elements[campo];
        const valor = input?.value || "";
        const error = validarCampo(campo, valor);

        if (error) {
            mostrarErrorCampo(campo, error);
            valido = false;
        } else {
            limpiarErrorCampo(campo);
        }
    });

    return valido;
}

if (formularioRegistro) {
    formularioRegistro.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => {
            const error = validarCampo(input.name, input.value);
            if (error) {
                mostrarErrorCampo(input.name, error);
            } else {
                limpiarErrorCampo(input.name);
            }
        });
    });

    formularioRegistro.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!validarFormularioRegistro()) {
            mensajeRegistro.textContent = "Revisa los campos marcados para continuar.";
            mensajeRegistro.style.color = "#ff8a80";
            return;
        }

        const datos = new FormData(formularioRegistro);
        const nombre = (datos.get("nombre") || "").trim();
        const email = (datos.get("email") || "").trim();
        const telefono = (datos.get("telefono") || "").trim();
        const municipio = (datos.get("municipio") || "").trim();
        const password = (datos.get("password") || "").trim();

        const usuarios = getUsuarios();
        const existeCorreo = usuarios.some(usuario =>
            usuario.email.toLowerCase() === email.toLowerCase()
        );

        if (existeCorreo) {
            mensajeRegistro.style.color = "#ff4d4d";
            mensajeRegistro.textContent = "Este correo ya está registrado.";
            return;
        }

        const nuevoUsuario = {
            nombre,
            email,
            telefono,
            municipio,
            password,
            fechaRegistro: new Date().toLocaleDateString("es-CO"),
            puntajes: [],
            retosCompletados: [],
            promedio: 0,
            mejorPuntaje: 0
        };

        usuarios.push(nuevoUsuario);
        guardarUsuarios(usuarios);
        guardarUsuarioActivo(nuevoUsuario);

        mensajeRegistro.style.color = "#ffd600";
        mensajeRegistro.textContent = "Usuario creado correctamente. Redirigiendo...";
        bienvenida.textContent = `Hola, ${nombre}`;
        formularioRegistro.reset();

        setTimeout(() => {
            window.location.replace("interfas.html");
        }, 400);
    });
}

if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", cerrarSesion);
}

if (btnCerrarSesionPanel) {
    btnCerrarSesionPanel.addEventListener("click", cerrarSesion);
}

const usuarioActivo = getUsuarioActivo();
const enPaginaFormulario = window.location.pathname.endsWith('/formulario.html') || window.location.pathname.endsWith('formulario.html');

if (usuarioActivo && enPaginaFormulario) {
    window.location.replace('interfas.html');
}

if (usuarioActivo && panelUsuario && bienvenida) {
    bienvenida.textContent = `Hola, ${usuarioActivo.nombre}`;
    panelUsuario.classList.remove("oculto");
}

if (usuarioActivo) {
    renderUsuarioPanel(usuarioActivo);
}

const enPaginaPanel = window.location.pathname.endsWith("/interfas.html") || window.location.pathname.endsWith("interfas.html");
if (enPaginaPanel && !usuarioActivo) {
    window.location.href = "formulario.html";
}

/* =========================
   LOGIN
========================= */

if (formularioLogin) {

    formularioLogin.addEventListener("submit", function (e) {

        e.preventDefault();

        const datos = new FormData(formularioLogin);

        const email = (datos.get("email") || "").trim();
        const password = (datos.get("password") || "").trim();

        const usuarios = getUsuarios();

        const usuario = usuarios.find(u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );

        if (!usuario) {

            mensajeLogin.style.color = "#ff4d4d";
            mensajeLogin.textContent =
                "Correo o contraseña incorrectos.";

            return;

        }

        guardarUsuarioActivo(usuario);

        mensajeLogin.style.color = "#fdfd01";
        mensajeLogin.textContent =
            "Inicio de sesión correcto.";

        setTimeout(() => {
            window.location.href = "interfas.html";
        }, 600);

    });
}

