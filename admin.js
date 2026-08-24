// Credenciales sencillas para prueba
const USUARIO_CORRECTO = "admin";
const PASSWORD_CORRECTA = "1234";

// Elementos del DOM
const formLogin = document.getElementById("formLogin");
const errorLogin = document.getElementById("errorLogin");
const seccionLogin = document.getElementById("seccionLogin");
const seccionPanel = document.getElementById("seccionPanel");
const listaSolicitudes = document.getElementById("listaSolicitudes");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

// ===========================
// INICIO DE SESIÓN
// ===========================
formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("password").value;

    if (user === USUARIO_CORRECTO && pass === PASSWORD_CORRECTA) {
        // Guardar sesión activa
        sessionStorage.setItem("adminAutenticado", "true");
        mostrarPanel();
    } else {
        errorLogin.textContent = "Usuario o contraseña incorrectos ❌";
        errorLogin.style.display = "block";
    }
});

// ===========================
// MOSTRAR PANEL DE CONTROL
// ===========================
function mostrarPanel() {
    seccionLogin.style.display = "none";
    seccionPanel.style.display = "block";
    cargarSolicitudes();
}

// ===========================
// CARGAR SOLICITUDES GUARDADAS
// ===========================
function cargarSolicitudes() {
    const solicitudes = JSON.parse(localStorage.getItem("solicitudesPokemon")) || [];

    if (solicitudes.length === 0) {
        listaSolicitudes.innerHTML = "<p style='font-size: 18px; color: #8e7dbe;'>No hay solicitudes registradas aún. ✨</p>";
        return;
    }

    listaSolicitudes.innerHTML = "";

    solicitudes.forEach((sol, index) => {
        const div = document.createElement("div");
        div.classList.add("tarjeta-solicitud");

        div.innerHTML = `
            <h3>📩 Solicitud de: ${sol.nombre}</h3>
            <p><strong>Correo:</strong> ${sol.email}</p>
            <p><strong>Pokémon deseado:</strong> ${sol.pokemon}</p>
            <p><strong>Detalles:</strong> ${sol.mensaje || "Sin detalles"}</p>
            <p><small>📅 Fecha: ${sol.fecha}</small></p>
            <button class="btn-eliminar" onclick="eliminarSolicitud(${index})">Eliminar 🗑️</button>
        `;

        listaSolicitudes.appendChild(div);
    });
}

// ===========================
// ELIMINAR SOLICITUD
// ===========================
function eliminarSolicitud(index) {
    let solicitudes = JSON.parse(localStorage.getItem("solicitudesPokemon")) || [];
    solicitudes.splice(index, 1);
    localStorage.setItem("solicitudesPokemon", JSON.stringify(solicitudes));
    cargarSolicitudes();
}

// ===========================
// CERRAR SESIÓN
// ===========================
btnCerrarSesion.addEventListener("click", () => {
    sessionStorage.removeItem("adminAutenticado");
    seccionPanel.style.display = "none";
    seccionLogin.style.display = "block";
    formLogin.reset();
});

// Verificar si ya estaba logueado al recargar
if (sessionStorage.getItem("adminAutenticado") === "true") {
    mostrarPanel();
}