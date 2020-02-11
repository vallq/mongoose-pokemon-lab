require("dotenv").config();
require("./utils/db");
const PORT = 3000;
const app = require("./app");

app.listen(PORT, () => {
  console.log(`You are on the server on http://localhost:${PORT}`);
});

// const BasicPokemon = require("./models/pokemon.model.js");
// const pokemons = require("./data/pokemonData");
// const createMultiplePokemon = async pokemons => {
//   try {
//     await BasicPokemon.create(pokemons);
//   } catch (err) {
//     console.log(err);
//   }
// };

// createMultiplePokemon(pokemons);

// const findAll = async () => {
//     const foundPokemon = await  BasicPokemon.find();
//     return foundPokemon;
//   };

// //findAll().then(value => console.log(value));
