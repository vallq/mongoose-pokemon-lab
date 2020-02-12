const request = require("supertest");
const app = require("../app.js");
const Pokemon = require("../models/pokemon.model.js");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");


jest.mock("jsonwebtoken");

describe("pokemon", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      const mongoOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      };
      await mongoose.connect(mongoUri, mongoOptions);
    } catch (err) {
      console.error(err);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const pokemonData = [
      {
        id: 1,
        name: "Pikachu",
        japaneseName: "ピカチュウ",
        baseHP: 35,
        category: "Mouse Pokemon"
      },
      {
        id: 2,
        name: "Squirtle",
        japaneseName: "ゼニガメ",
        baseHP: 44,
        category: "Tiny Turtle Pokemon"
      }
    ];
    await Pokemon.create(pokemonData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Pokemon.deleteMany();
  });

  describe("/", () => {
    it("0: GET / should respond with API endpoints", async () => {
      const apiEndpoints = {
        "0": "GET    /",
        "1": "GET   /pokemons",
        "2": "GET   /pokemons?name=pokemonNameNotExact",
        "3": "POST    /pokemons",
        "4": "GET /pokemons/:id",
        "5": "PUT /pokemons/:id",
        "6": "PATCH /pokemons/:id",
        "7": "DELETE /pokemons/:id"
      };
      const { body: apiPoints } = await request(app)
        .get("/")
        .expect(200);
      expect(apiPoints).toMatchObject(apiEndpoints);
    });
  });
  describe("/pokemon", () => {
    it("1: GET / should respond with all Pokemons", async () => {
      const expectedPokemonData = [
        {
          id: 1,
          name: "Pikachu",
          japaneseName: "ピカチュウ",
          baseHP: 35,
          category: "Mouse Pokemon"
        },
        {
          id: 2,
          name: "Squirtle",
          japaneseName: "ゼニガメ",
          baseHP: 44,
          category: "Tiny Turtle Pokemon"
        }
      ];

      const { body: actualPokemons } = await request(app)
        .get("/pokemon")
        .expect(200);
      //actualPokemons.sort((a, b) => a.id > b.id);
      expect(actualPokemons).toMatchObject(expectedPokemonData);
    });
  });

  describe("/pokemon?name=notExact || /pokemon/:id", () => {
    it("2: GET / should respond with Pikachu when query parameter is chu", async () => {
      const expectedPokemonData = [
        {
          id: 1,
          name: "Pikachu",
          japaneseName: "ピカチュウ",
          baseHP: 35,
          category: "Mouse Pokemon"
        }
      ];
      const { body: actualPokemons } = await request(app)
        .get(`/pokemon?name=chu`)
        .expect(200);
      expect(actualPokemons).toMatchObject(expectedPokemonData);
    });

    it("3 POST / should respond with newly inserted Pokemon", async () => {
      jwt.verify.mockReturnValueOnce({});

      const expectedPokemon = {
        id: 3,
        name: "Charmander",
        japaneseName: "ヒトカゲ",
        baseHP: 39,
        category: "Tiny Lizard Pokemon"
      };
      const { body: actualPokemons } = await request(app)
        .post("/pokemon")
        .set("Cookie", "token=valid-token")
        .send(expectedPokemon)
        .expect(201);
      expect(actualPokemons).toMatchObject(expectedPokemon);
    });

    it("4: GET / should respond with Squirtle when id is 2", async () => {
      const expectedPokemon = [
        {
          id: 2,
          name: "Squirtle",
          japaneseName: "ゼニガメ",
          baseHP: 44,
          category: "Tiny Turtle Pokemon"
        }
      ];
      const { body: actualPokemons } = await request(app)
        .get(`/pokemon/${expectedPokemon[0].id}`)
        .expect(200);
      expect(actualPokemons).toMatchObject(expectedPokemon);
    });

    it("5: PUT / should respond with updated Pikachu stats", async () => {
      const expectedPokemon = {
        id: 1,
        name: "Pikachu",
        japaneseName: "ピカチュウ",
        baseHP: 35,
        category: "Tiny Mouse Pokemon"
      };
      const { body: actualPokemons } = await request(app)
        .put(`/pokemon/${expectedPokemon.id}`)
        .send(expectedPokemon)
        .expect(200);
      expect(actualPokemons).toMatchObject(expectedPokemon);
    });

    // it("PUT should respond with 400 error", async () => {
    //   const errorData = {
    //     id: 1
    //   };
    //   const { body: actualPokemons } = await request(app)
    //     .put(`/pokemon/${errorData.id}`)
    //     .send(errorData)
    //     .expect(400);
    //   expect(actualPokemons).toMatchObject(err.message);
    // });
    // "6": "PATCH /pokemons/:id",
    it("6: PATCH / should respond with updated Pokemon stat", async () => {
      const expectedPokemon = {
        id: 1,
        name: "Pikachu Two"
      };
      const { body: actualPokemons } = await request(app)
        .patch(`/pokemon/${expectedPokemon.id}`)
        .send(expectedPokemon)
        .expect(200);
      expect(actualPokemons.name).toBe(expectedPokemon.name);
    });

    // "7": "DELETE /pokemons/:id"
    it("7: DELETE / should respond with Pokemon that has been removed", async () => {
      const expectedPokemon = {
        id: 2,
        name: "Squirtle",
        japaneseName: "ゼニガメ",
        baseHP: 44,
        category: "Tiny Turtle Pokemon"
      };
      const { body: actualPokemons } = await request(app)
        .delete(`/pokemon/${expectedPokemon.id}`)
        .send(expectedPokemon)
        .expect(200);
      expect(actualPokemons).toMatchObject(expectedPokemon);
    });
  });
});
