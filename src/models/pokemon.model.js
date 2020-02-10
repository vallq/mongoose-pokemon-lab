const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BasicPokemonSchema = Schema({
  id: Number,
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  japaneseName: String,
  baseHP: Number,
  category: String
});

const BasicPokemon = mongoose.model("BasicPokemon", BasicPokemonSchema);

module.exports = BasicPokemon;
