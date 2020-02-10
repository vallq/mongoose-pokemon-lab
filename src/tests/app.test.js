const request = require("supertest");
const app = require("../app.js");
//const apiEndpoints = require("../data/apiEndpoints");

describe("app.js", () => {
  it("GET / should return all API endpoints", async () => {
    const apiEndpoints = require("../data/apiEndpoints");
    const response = await request(app)
      .get("/")
      .expect(200);
    expect(response.body).toEqual(apiEndpoints);
  });

    // describe("pokemon.route.js", () => {
    //   it("GET / should return all Pokemon data", async () => {
    //     //const pokemonData = require("../data/pokemonData");
    //     const response = await request(app)
    //       .get("/pokemon")
    //       .expect(200);
    //     expect(response.body).toEqual(pokemonData);
    //   });
    // });
});
