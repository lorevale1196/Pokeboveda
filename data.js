

const products = [
    {
        id: 1,
        name: "Pikachu ⚡",
        category: "singles",
        price: 25000,
        stock: 10,
        image: "https://assets.tcgdex.net/en/base/base1/58/high.png"
    },
    {
        id: 2,
        name: "Charizard 🔥",
        category: "singles",
        price: 80000,
        stock: 10,
        image: "https://assets.tcgdex.net/en/base/base1/4/high.png"
    },
    {
        id: 3,
        name: "Bulbasaur 🌱",
        category: "singles",
        price: 15000,
        stock: 10,
        image: "https://assets.tcgdex.net/en/base/base1/44/high.png"
    },
    {
        id: 4,
        name: "Blastoise 💧",
        category: "singles",
        price: 75000,
        stock: 10,
        image: "https://images.pokemontcg.io/base1/2_hires.png"
    },
    {
        id: 5,
        name: "Venusaur 🌿",
        category: "singles",
        price: 70000,
        stock: 10,
        image: "https://images.pokemontcg.io/base1/15_hires.png"
    },
    {
        id: 6,
        name: "Mewtwo 🧠",
        category: "singles",
        price: 90000,
        stock: 10,
        image: "https://images.pokemontcg.io/base1/10_hires.png"
    },
    {
        id: 7,
        name: "Zapdos ⚡",
        category: "singles",
        price: 65000,
        stock: 10,
        image: "https://images.pokemontcg.io/base1/16_hires.png"
    },
    {
        id: 8,
        name: "Raichu ⚡",
        category: "singles",
        price: 40000,
        stock: 10,
        image: "https://images.pokemontcg.io/base1/14_hires.png"
    },
    {
        id: 9,
        name: "Gyarados 🌊",
        category: "singles",
        price: 55000,
        stock: 10,
        image: "https://images.pokemontcg.io/base1/6_hires.png"
    }
];


function formatPrice(value) {
    return "$" + value.toLocaleString("es-CO");
}
