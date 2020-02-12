const express = require("express");
const app = express();
const apiEndpoints = require("./data/apiEndpoints.js");
const pokemonData = require("./data/pokemonData.js");
const pokemonRouter = require("./routes/pokemon.route.js");
const trainerRouter = require("./routes/trainers.route.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = {
  credentials: true,
  allowedHeaders: "content-type",
  origin: "http://localhost:3001"
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use("/pokemon", pokemonRouter);
app.use("/trainers", trainerRouter);

//0: get API endpoints
app.get("/", (req, res) => {
  res.send(apiEndpoints);
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  console.log(err);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
});

module.exports = app;
