
const buscador = document.getElementById("buscarPokemon");

const productosEnPagina = document.querySelectorAll(".producto");

if (buscador) {

    buscador.addEventListener("input", () => {

        const texto = buscador.value.toLowerCase();

        productosEnPagina.forEach(producto => {

            const nombre = producto.querySelector("h3").textContent.toLowerCase();

            if (nombre.includes(texto)) {
                producto.style.display = "block";
            } else {
                producto.style.display = "none";
            }

        });

    });

}

const cartas = document.querySelectorAll(".carta-3d");

cartas.forEach(carta => {

    carta.addEventListener("click", () => {
        carta.classList.toggle("volteada");
    });

});


