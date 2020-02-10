# Jumpstart Batch 7 mongoose-pokemon-lab
Express + MongoDB/Mongoose
Lab: Build a basic CRUD API for the pokemon list (Create / Read / Update / Delete)

We will implement a basic CRUD API in Express for Pokemon list with the below 8 routes:

We are creating an API to interact with the resources on the server.

API endpoints
Route: GET / HTTP Response status code: 200
Expected response:

{
  "0": "GET    /",
  "1": "GET   /pokemons",
  "2": "GET   /pokemons?name=pokemonNameNotExact",
  "3": "POST    /pokemons",
  "4": "GET /pokemons/:id",
  "5": "PUT /pokemons/:id",
  "6": "PATCH /pokemons/:id",
  "7": "DELETE /pokemons/:id"
}
