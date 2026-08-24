
const CART_STORAGE_KEY = "pokeboveda_carrito";


const WHATSAPP_NUMERO = "573245427319";


let cart = cargarCarrito();


function cargarCarrito() {
    const guardado = localStorage.getItem(CART_STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : [];
}

function guardarCarrito() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}


function addToCart(id) {

    const producto = products.find(p => p.id === id);

    if (!producto) return;

    const itemExistente = cart.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        cart.push({ id: id, cantidad: 1 });
    }

    guardarCarrito();
    renderCart();
    mostrarMensajeCarrito();
}

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

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    guardarCarrito();
    renderCart();
}


function calcularTotal() {

    return cart.reduce((total, item) => {
        const producto = products.find(p => p.id === item.id);
        return producto ? total + (producto.price * item.cantidad) : total;
    }, 0);
}


function contarItems() {
    return cart.reduce((total, item) => total + item.cantidad, 0);
}


function renderCart() {

    const lista = document.getElementById("listaCarrito");
    const contador = document.getElementById("cantidadCarrito");
    const totalEl = document.getElementById("totalCarrito");


    if (!lista || !contador || !totalEl) return;

    contador.textContent = contarItems();
    totalEl.textContent = formatPrice(calcularTotal());

    if (cart.length === 0) {
        lista.innerHTML = `<p class="carritoVacio">Tu carrito está vacío 🛒</p>`;
        return;
    }

    lista.innerHTML = cart.map(item => {

        const producto = products.find(p => p.id === item.id);

        if (!producto) return "";

        return `
            <div class="productoCarrito">

                <img src="${producto.image}" alt="${producto.name}" class="miniaturaCarrito">

                <div class="infoCarrito">

                    <span class="nombreCarrito">${producto.name}</span>
                    <span class="precioCarrito">${formatPrice(producto.price)}</span>

                    <div class="cantidadControles">
                        <button onclick="changeQty(${producto.id}, -1)">−</button>
                        <span>${item.cantidad}</span>
                        <button onclick="changeQty(${producto.id}, 1)">+</button>
                    </div>

                </div>

                <button class="eliminarProducto" onclick="removeFromCart(${producto.id})">✕</button>

            </div>
        `;

    }).join("");
}


function abrirCarrito() {

    document.getElementById("panelCarrito").classList.add("open");
    document.getElementById("overlayCarrito").classList.add("open");

    renderCart();
}

function cerrarCarrito() {

    document.getElementById("panelCarrito").classList.remove("open");
    document.getElementById("overlayCarrito").classList.remove("open");
}


function mostrarMensajeCarrito() {

    const mensaje = document.getElementById("mensajeCarrito");

    if (!mensaje) return;

    mensaje.textContent = "💗 Producto agregado al carrito 🛒";
    mensaje.style.display = "block";

    setTimeout(() => {
        mensaje.style.display = "none";
    }, 2000);
}

function finalizarCompra() {

    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega alguna carta antes de finalizar la compra 🛒");
        return;
    }


    let mensaje = "¡Hola! 👋 Quiero hacer este pedido en Pokebóveda:\n\n";

    cart.forEach(item => {

        const producto = products.find(p => p.id === item.id);

        if (!producto) return;

        const subtotal = producto.price * item.cantidad;

        mensaje += `• ${producto.name} x${item.cantidad} — ${formatPrice(subtotal)}\n`;
    });

    mensaje += `\nTotal: ${formatPrice(calcularTotal())}`;

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
}


document.addEventListener("DOMContentLoaded", renderCart);
