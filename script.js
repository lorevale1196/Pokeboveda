const buscador = document.getElementById("buscarPokemon");

const productos = document.querySelectorAll(".producto");

buscador.addEventListener("input", () => {

    const texto = buscador.value.toLowerCase();

    productos.forEach(producto => {

        const nombre = producto.querySelector("h3").textContent.toLowerCase();

        if(nombre.includes(texto)){

            producto.style.display = "block";

        }else{

            producto.style.display = "none";

        }

    });

});
