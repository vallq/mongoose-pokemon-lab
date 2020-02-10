const express = require("express");
const app = express();
const apiEndpoints = require("./data/apiEndpoints.js");
const pokemonData = require("./data/pokemonData.js");
const pokemonRouter = require("./routes/pokemon.route.js");

app.use(express.json());
app.use("/pokemon", pokemonRouter);

//0: get API endpoints
app.get("/", (req, res) => {
  res.send(apiEndpoints);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  console.log(err);
  if (err.status) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
});

module.exports = app;
