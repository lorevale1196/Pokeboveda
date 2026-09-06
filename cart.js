const CART_STORAGE_KEY = "pokeboveda_carrito";

const WHATSAPP_NUMERO = "573245427319";

let cart = cargarCarrito();


// ==========================
// CARGAR Y GUARDAR CARRITO
// ==========================

function cargarCarrito() {
    const guardado = localStorage.getItem(CART_STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : [];
}

function guardarCarrito() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}


// ==========================
// BUSCAR PRODUCTO
// ==========================

function buscarProducto(id) {

    let producto = products.find(p => p.id === id);

    if (!producto && typeof listaPokemon !== "undefined") {
        producto = listaPokemon.find(p => p.id === id);
    }

    return producto;
}


// ==========================
// OBTENER PRECIO
// ==========================

function obtenerPrecio(producto) {

    if (producto.price !== undefined) {
        return producto.price;
    }

    if (producto.priceCOP) {
        return parseInt(
            producto.priceCOP.replace(/\D/g, ""),
            10
        );
    }

    return 0;
}


// ==========================
// AGREGAR AL CARRITO
// ==========================

function addToCart(id) {

    const producto = buscarProducto(id);

    if (!producto) {
        console.error("No se encontró la carta:", id);
        return;
    }

    const itemExistente = cart.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        cart.push({
            id: id,
            cantidad: 1
        });
    }

    guardarCarrito();
    renderCart();
    mostrarMensajeCarrito();
}


// ==========================
// CAMBIAR CANTIDAD
// ==========================

function changeQty(id, delta) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.cantidad += delta;

    if (item.cantidad <= 0) {
        removeFromCart(id);
        return;
    }

    guardarCarrito();
    renderCart();
}


// ==========================
// ELIMINAR PRODUCTO
// ==========================

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    guardarCarrito();
    renderCart();
}


// ==========================
// CALCULAR TOTAL
// ==========================

function calcularTotal() {

    return cart.reduce((total, item) => {

        const producto = buscarProducto(item.id);

        if (!producto) {
            return total;
        }

        return total + (
            obtenerPrecio(producto) * item.cantidad
        );

    }, 0);
}


// ==========================
// CONTAR PRODUCTOS
// ==========================

function contarItems() {

    return cart.reduce(
        (total, item) => total + item.cantidad,
        0
    );
}


// ==========================
// MOSTRAR CARRITO
// ==========================

function renderCart() {

    const lista = document.getElementById("listaCarrito");
    const contador = document.getElementById("cantidadCarrito");
    const totalEl = document.getElementById("totalCarrito");

    if (!lista || !contador || !totalEl) return;

    contador.textContent = contarItems();

    totalEl.textContent = formatPrice(calcularTotal());


    // CARRO VACÍO

    if (cart.length === 0) {

        lista.innerHTML = `
            <p class="carritoVacio">
                Tu carrito está vacío 🛒
            </p>
        `;

        return;
    }


    // MOSTRAR PRODUCTOS

    lista.innerHTML = cart.map(item => {

        const producto = buscarProducto(item.id);

        if (!producto) return "";


        return `
            <div class="productoCarrito">

                <img
                    src="${producto.image}"
                    alt="${producto.name}"
                    class="miniaturaCarrito"
                >

                <div class="infoCarrito">

                    <span class="nombreCarrito">
                        ${producto.name}
                    </span>

                    <span class="precioCarrito">
                        ${formatPrice(obtenerPrecio(producto))}
                    </span>

                    <div class="cantidadControles">

                        <button
                            onclick="changeQty('${producto.id}', -1)">
                            −
                        </button>

                        <span>
                            ${item.cantidad}
                        </span>

                        <button
                            onclick="changeQty('${producto.id}', 1)">
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="eliminarProducto"
                    onclick="removeFromCart('${producto.id}')">
                    ✕
                </button>

            </div>
        `;

    }).join("");
}


// ==========================
// ABRIR CARRITO
// ==========================

function abrirCarrito() {

    document
        .getElementById("panelCarrito")
        .classList.add("open");

    document
        .getElementById("overlayCarrito")
        .classList.add("open");

    renderCart();
}


// ==========================
// CERRAR CARRITO
// ==========================

function cerrarCarrito() {

    document
        .getElementById("panelCarrito")
        .classList.remove("open");

    document
        .getElementById("overlayCarrito")
        .classList.remove("open");
}


// ==========================
// CERRAR AL TOCAR AFUERA
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const overlayCarrito =
        document.getElementById("overlayCarrito");

    if (overlayCarrito) {

        overlayCarrito.addEventListener("click", () => {
            cerrarCarrito();
        });

    }

});


// ==========================
// MENSAJE DE PRODUCTO AGREGADO
// ==========================

function mostrarMensajeCarrito() {

    const mensaje =
        document.getElementById("mensajeCarrito");

    if (!mensaje) return;

    mensaje.textContent =
        "💗 Producto agregado al carrito 🛒";

    mensaje.style.display = "block";

    setTimeout(() => {

        mensaje.style.display = "none";

    }, 2000);
}


// ==========================
// FINALIZAR COMPRA
// ==========================

function finalizarCompra() {

    if (cart.length === 0) {

        alert(
            "Tu carrito está vacío. Agrega alguna carta antes de finalizar la compra 🛒"
        );

        return;
    }


    let mensaje =
        "¡Hola! 👋 Quiero hacer este pedido en Pokebóveda:\n\n";


    cart.forEach(item => {

        const producto = buscarProducto(item.id);

        if (!producto) return;


        const subtotal =
            obtenerPrecio(producto) * item.cantidad;


        mensaje +=
            `• ${producto.name} x${item.cantidad} — ${formatPrice(subtotal)}\n`;

    });


    mensaje +=
        `\nTotal: ${formatPrice(calcularTotal())}`;


    const url =
        `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;


    window.open(url, "_blank");
}


// ==========================
// ACTUALIZAR AL CARGAR
// ==========================

document.addEventListener(
    "DOMContentLoaded",
    renderCart
);