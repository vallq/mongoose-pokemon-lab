const express = require("express");
const router = express.Router();
const Pokemon = require("../models/pokemon.model.js");
const wrapAsync = require("../utils/wrapAsync.js");

const filterByName = async name => {
  const nameFilterRegex = new RegExp(name, "gi");
  const filteredPokemon = await Pokemon.find({ name: nameFilterRegex });
  return filteredPokemon;
};

// const filterById = async id => {
//   const pokemonId = id;
//   const filteredPokemon = await Pokemon.find({ id: pokemonId });
//   return filteredPokemon;
// };

//1: GET all pokemon
router.get(
  "/",
  wrapAsync(async (req, res) => {
    if (req.query === "") {
      const pokemon = await Pokemon.find();
      res.status(200).send(pokemon);
      console.log("hello Pokemon");
    } else {
      //2: GET   /pokemons?name=pokemonNameNotExact"
      const name = req.query.name;
      const pokemon = await filterByName(name);
      res.status(200).send(pokemon);
    }
  })
);

//3: "POST    /pokemons",
router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    const pokemon = new Pokemon(req.body);
    await Pokemon.init(); //make sure the indexes are done building;
    const newPokemon = await pokemon.save();
    res.status(201).send(newPokemon);
  })
);

//4: "GET /pokemons/:id",
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const targetPokemonId = req.params.id;
    const pokemon = await Pokemon.find({ id: targetPokemonId });
    //pokemon.then(data => res.status(200).send(data));
    res.status(200).send(pokemon);
  })
);

//5: "PUT /pokemon/:id"
router.put(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const targetPokemonId = req.params.id;
    const newPokemon = req.body;
    const pokemon = await Pokemon.findOneAndReplace(
      { id: targetPokemonId },
      newPokemon,
      { new: true }
    );
    res.send(pokemon);
  })
);

//6: "PATCH /pokemons/:id",
router.patch(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const targetPokemonId = req.params.id;
    const infoToUpdate = req.body;
    const pokemon = await Pokemon.findOneAndUpdate(
      { id: targetPokemonId },
      infoToUpdate,
      { new: true }
    );
    res.send(pokemon);
  })
);

//7: "DELETE /pokemons/:id",
router.delete(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const targetPokemonId = req.params.id;
    const pokemonToDelete = await Pokemon.findOneAndRemove({
      id: targetPokemonId
    });
    res.send(pokemonToDelete);
  })
);

// router.use((err, req, res, next) => {
//   if (err.name === "ValidateionError") {
//     err.statusCode = 400;
//   } else if (err.name === "MongoError" && err.code === 11000) {
//     err.statusCode = 422;
//   }
//   next(err);
// }); need to check why this results in the async not completing

module.exports = router;
