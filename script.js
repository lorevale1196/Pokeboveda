// Contenedores principales
const buscador = document.getElementById("buscarPokemon");
const contenedorCartas = document.getElementById("contenedorCartas");

// Lista para guardar las cartas descargadas
let listaPokemon = [];

// Tasa de cambio para conversión (1 USD = 4,000 COP)
const TASA_COP = 4000;

// ===========================
// CARGAR 150 CARTAS ACTUALES (TCG)
// ===========================
async function obtener150PokemonActuales() {
    contenedorCartas.innerHTML = "<p style='font-size:20px; color:#ff6f91;'>Cargando 150 cartas mágicas modernas... ✨</p>";

    try {
        const resSets = await fetch("https://api.tcgdex.net/v2/en/sets");
        const sets = await resSets.json();

        const setsRecientes = sets.reverse().slice(0, 10); 
        let cartasAcumuladas = [];

        for (const setInfo of setsRecientes) {
            if (cartasAcumuladas.length >= 150) break;

            const resSetData = await fetch(`https://api.tcgdex.net/v2/en/sets/${setInfo.id}`);
            const setData = await resSetData.json();

            if (setData.cards && setData.cards.length > 0) {
                const cartasConFoto = setData.cards.filter(c => c.image);
                cartasAcumuladas = cartasAcumuladas.concat(cartasConFoto);
            }
        }

        const seleccion150 = cartasAcumuladas.slice(0, 150);

        listaPokemon = seleccion150.map(carta => {
            const precioUSDNum = Math.floor(Math.random() * 85) + 15;
            const precioCOPNum = precioUSDNum * TASA_COP;

            return {
                id: carta.id,
                name: carta.name,
                image: `${carta.image}/high.png`,
                priceUSD: `$${precioUSDNum.toFixed(2)} USD`,
                priceCOP: `$${precioCOPNum.toLocaleString('es-CO')} COP`
            };
        });

        renderizarCartas(listaPokemon);
    } catch (error) {
        console.error("Error al cargar cartas:", error);
        contenedorCartas.innerHTML = "<p style='color:red;'>Ocurrió un error al cargar las cartas actuales. Intenta de nuevo.</p>";
    }
}

// ===========================
// RENDERIZAR CARTAS EN HTML
// ===========================
function renderizarCartas(cartasAMostrar) {
    contenedorCartas.innerHTML = ""; 

    cartasAMostrar.forEach(carta => {
        const productoDiv = document.createElement("div");
        productoDiv.classList.add("producto");

        productoDiv.innerHTML = `
            <div class="carta-3d">
                <div class="cara frente">
                    <img class="carta-real" 
                        src="${carta.image}" 
                        alt="${carta.name}"
                        onerror="this.onerror=null; this.src='img/pokemon-back.png';">
                </div>
                <div class="cara atras">
                    <img class="carta-real" src="img/pokemon-back.png" alt="Reverso Pokémon">
                </div>
            </div>
            <h3>${carta.name}</h3>
            <div class="precios-contenedor">
                <p class="precio-usd">${carta.priceUSD}</p>
                <p class="precio-cop">${carta.priceCOP}</p>
            </div>
            <button class="btn-comprar">Comprar 🛒</button>
        `;

const carta3d = productoDiv.querySelector(".carta-3d");

carta3d.addEventListener("click", () => {
    carta3d.classList.toggle("volteada");
});

const botonComprar = productoDiv.querySelector(".btn-comprar");

botonComprar.addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(carta.id);
});

contenedorCartas.appendChild(productoDiv);
});
}

// ===========================
// BUSCADOR EN TIEMPO REAL
// ===========================
if (buscador) {
    buscador.addEventListener("input", () => {
        const texto = buscador.value.toLowerCase().trim();
        
        const filtrados = listaPokemon.filter(pokemon => 
            pokemon.name.toLowerCase().includes(texto)
        );

        renderizarCartas(filtrados);
    });
}

// ===========================
// MANEJO DEL FORMULARIO DE SOLICITUDES
// ===========================
const formSolicitud = document.getElementById("formSolicitud");
const mensajeExito = document.getElementById("mensajeExito");

if (formSolicitud) {
    formSolicitud.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombreCliente").value;
        const email = document.getElementById("emailCliente").value;
        const pokemon = document.getElementById("nombrePokemon").value;
        const mensaje = document.getElementById("mensajeCliente").value;

        const nuevaSolicitud = {
            id: Date.now(),
            nombre,
            email,
            pokemon,
            mensaje,
            fecha: new Date().toLocaleDateString()
        };

        let solicitudes = JSON.parse(localStorage.getItem("solicitudesPokemon")) || [];
        solicitudes.push(nuevaSolicitud);
        localStorage.setItem("solicitudesPokemon", JSON.stringify(solicitudes));

        mensajeExito.textContent = `¡Gracias, ${nombre}! Solicitud de "${pokemon}" enviada con éxito. ✨`;
        mensajeExito.style.display = "block";

        formSolicitud.reset();

        setTimeout(() => {
            mensajeExito.style.display = "none";
        }, 5000);
    });
}

// ===========================
// CHATBOT ASESOR
// ===========================
const btnChatbot = document.getElementById("btnChatbot");
const ventanaChat = document.getElementById("ventanaChat");
const btnCerrarChat = document.getElementById("btnCerrarChat");
const btnEnviarChat = document.getElementById("btnEnviarChat");
const inputChat = document.getElementById("inputChat");
const chatMensajes = document.getElementById("chatMensajes");

if (btnChatbot) {
    btnChatbot.addEventListener("click", () => {
        ventanaChat.style.display = ventanaChat.style.display === "none" ? "flex" : "none";
    });

    btnCerrarChat.addEventListener("click", () => {
        ventanaChat.style.display = "none";
    });

    btnEnviarChat.addEventListener("click", procesarMensajeUsuario);
    inputChat.addEventListener("keypress", (e) => {
        if (e.key === "Enter") procesarMensajeUsuario();
    });
}

function procesarMensajeUsuario() {
    const texto = inputChat.value.trim();
    if (texto === "") return;

    agregarMensaje(texto, "usuario");
    inputChat.value = "";

    setTimeout(() => {
        const respuesta = obtenerRespuestaBot(texto.toLowerCase());
        agregarMensaje(respuesta, "bot");
    }, 600);
}

function agregarMensaje(texto, remitente) {
    const div = document.createElement("div");
    div.classList.add("mensaje", remitente);
    div.textContent = texto;
    chatMensajes.appendChild(div);
    chatMensajes.scrollTop = chatMensajes.scrollHeight;
}

function obtenerRespuestaBot(mensaje) {
    if (mensaje.includes("hola") || mensaje.includes("buenas") || mensaje.includes("hi") || mensaje.includes("hey")) {
        return "¡Hola! ✨ Soy Pokebot, tu asesor Pokémon. ¿Buscas cartas para jugar torneos, para coleccionar o de algún tipo en específico?";
    }

    if (mensaje.includes("jugar") || mensaje.includes("competitivo") || mensaje.includes("deck") || mensaje.includes("mazo") || mensaje.includes("torneo")) {
        return "⚔️ ¡Para jugar te recomiendo buscar las cartas de Charizard ex, Iron Valiant ex o Pikachu VMAX! Tienen ataques devastadores y son pilares en el formato actual.";
    }

    if (mensaje.includes("coleccionar") || mensaje.includes("coleccion") || mensaje.includes("rara") || mensaje.includes("bonita") || mensaje.includes("arte") || mensaje.includes("valiosa")) {
        return "💎 ¡Si coleccionas, busca las Ilustraciones Especiales (Alt Art)! Cartas de Eeveelutions (Umbreon, Sylveon) o los iniciales de Kanto son las joyas con mayor valor y belleza estética.";
    }

    if (mensaje.includes("fuego") || mensaje.includes("charizard") || mensaje.includes("arcanine")) {
        return "🔥 Para tipo Fuego, Charizard ex y Entei V son infaltables. ¡Tienen un poder de ataque impresionante!";
    }

    if (mensaje.includes("agua") || mensaje.includes("blastoise") || mensaje.includes("greninja")) {
        return "💧 Para tipo Agua, Greninja ex y Chien-Pao ex son increíbles acelerando energías de agua en el juego.";
    }

    if (mensaje.includes("electrico") || mensaje.includes("rayo") || mensaje.includes("pikachu") || mensaje.includes("miraidon")) {
        return "⚡ Para tipo Eléctrico, Miraidon ex es la mejor opción: te permite llenar tu banca rápidamente con Pokémon eléctricos.";
    }

    if (mensaje.includes("psiquico") || mensaje.includes("mewtwo") || mensaje.includes("gardevoir")) {
        return "🔮 Gardevoir ex es la reina del tipo Psíquico. Permite reciclar energías de la zona de descarte sin límite.";
    }

    if (mensaje.includes("envio") || mensaje.includes("envíos") || mensaje.includes("entregas")) {
        return "🚚 Hacemos envíos seguros a todo el país. Cada carta va en funda (sleeve) y protector rígido (toploader) para cuidarla al 100%.";
    }

    if (mensaje.includes("pago") || mensaje.includes("comprar") || mensaje.includes("tarjeta")) {
        return "💳 Aceptamos transferencias bancarias, tarjetas de crédito y pagos digitales (Nequi/Daviplata).";
    }

    if (mensaje.includes("original") || mensaje.includes("reales") || mensaje.includes("autentica")) {
        return "🛡️ ¡100% Originales! Todas nuestras cartas son auténticas del Pokémon TCG oficial.";
    }

    return "🌸 Te puedo asesorar según lo que necesites. Pregúntame por:\n1. Cartas para 'jugar'\n2. Cartas para 'coleccionar'\n3. Cartas por tipo ('fuego', 'agua', 'eléctrico', 'psíquico').";
}

// Cargar las 150 cartas al iniciar
obtener150PokemonActuales();