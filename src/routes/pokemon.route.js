const express = require("express");
const router = express.Router();
const Pokemon = require("../models/pokemon.model.js");

const filterByName = async name => {
  const nameFilterRegex = new RegExp(name, "gi");
  const filteredPokemon = await Pokemon.find({ name: nameFilterRegex });
  return filteredPokemon;
};

const filterById = async id => {
  const pokemonId = id;
  const filteredPokemon = await Pokemon.find({ id: pokemonId });
  return filteredPokemon;
};

//1: GET all pokemon
router.get("/", async (req, res) => {
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
});

//3: "POST    /pokemons",
router.post("/", async (req, res, next) => {
  try {
    const pokemon = new Pokemon(req.body);
    await Pokemon.init(); //make sure the indexes are done building;
    const newPokemon = await pokemon.save();
    res.status(201).send(newPokemon);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    next(err);
  }
});

//4: "GET /pokemons/:id",
router.get("/:id", async (req, res, next) => {
  try {
    const targetPokemonId = req.params.id;
    const pokemon = await Pokemon.find({ id: targetPokemonId });
    //pokemon.then(data => res.status(200).send(data));
    res.status(200).send(pokemon);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    next(err);
  }
});

//5: "PUT /pokemon/:id"
router.put("/:id", async (req, res, next) => {
  try {
    const targetPokemonId = req.params.id;
    const newPokemon = req.body;
    const pokemon = await Pokemon.findOneAndReplace(
      { id: targetPokemonId },
      newPokemon,
      { new: true }
    );
    res.send(pokemon);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    next(err);
  }
});

//6: "PATCH /pokemons/:id",
router.patch("/:id", async (req, res, next) => {
  try {
    const targetPokemonId = req.params.id;
    const infoToUpdate = req.body;
    const pokemon = await Pokemon.findOneAndUpdate(
      { id: targetPokemonId },
      infoToUpdate,
      { new: true }
    );
    res.send(pokemon);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    next(err);
  }
});

//7: "DELETE /pokemons/:id",
router.delete("/:id", async (req, res, next) => {
  try {
    const targetPokemonId = req.params.id;
    const pokemonToDelete = await Pokemon.findOneAndRemove({
      id: targetPokemonId
    });
    res.send(pokemonToDelete);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    next(err);
  }
});

//   router.put("/:id", async (req, res, next) => {
//     try {
//       const targetPokemonId = req.params.id;
//     //   const pokemon = await filterById(targetPokemonId).then(
//     //     pokemon => (pokemon.category = "Tiny Mouse Pokemon")
//     //   );
//     //   pokemon.save();
//       res.status(200).send(pokemon);
//     } catch (err) {
//       if (err.name === "ValidationError") {
//         err.status = 400;
//       }
//       next(err);
//     }
//   });
/* const pokemonID = string(req.params.id);
  const newpokemon = req.body;
  const found pokemon = await expressPokemon.findOneandReplace({id = ppokemonId}, newPokemon, {new: true})*/
/* PATCH ... findOneAndUpdate, DELETE ... const pokemonId... const deletedPokmon = await Pokemon.findONeAndRemove({ id: pokemonId}) */

module.exports = router;
