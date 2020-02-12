const request = require("supertest");
const app = require("../app.js");
const Trainer = require("../models/trainer.model.js");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", true);

describe("trainers", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.error(err);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const trainerData = [
      {
        username: "ash2",
        password: "iWannaB3DVeryBest"
      },
      {
        username: "ash3",
        password: "iWannaB3DVeryBest"
      }
    ];
    await Trainer.create(trainerData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Trainer.deleteMany();
  });

  describe("/trainers", () => {
    it("POST / should add a new trainer and return the details", async () => {
      const expectedTrainer = {
        username: "ash1",
        password: "1WannaBeDVeryBest"
      };
      const { body: trainer } = await request(app)
        .post("/trainers")
        .send(expectedTrainer)
        .expect(201);
      expect(trainer.username).toBe(expectedTrainer.username);
      expect(trainer.password).not.toBe(expectedTrainer.password);
    });
  });
  it("GET / should return all trainers when retrieved", () => {});
  describe("/trainers/:username", () => {
    it("GET / should respond with trainer details when user is authorised", async () => {
      const expectedTrainer = {
        username: "ash2"
      };
      jwt.verify.mockReturnValueOnce({ name: expectedTrainer.username });
      const { body: trainer } = await request(app)
        .get(`/trainers/${expectedTrainer.username}`)
        .set("Cookie", "token=valid-token")
        .expect(200);
      expect(trainer[0]).toMatchObject(expectedTrainer);
    });

    it("GET / should respond with 403 error message when user is unauthorised", async () => {
      const wrongTrainer = {
        username: "ash3"
      };
      jwt.verify.mockReturnValueOnce({ name: wrongTrainer.username });
      const { body: error } = await request(app)
        .get(`/trainers/ash2`)
        .set("Cookie", "token=valid-token")
        .expect(403);
      expect(error).toEqual({ error: "Incorrect user" });
    });
  });
  describe("/trainers/login", () => {
    it("POST / should respond that the user is logged in when username and password are correct", async () => {
      const correctTrainer = {
        username: "ash2",
        password: "iWannaB3DVeryBest"
      };
      const { text: correctMessage } = await request(app)
        .post("/trainers/login")
        .send(correctTrainer)
        .expect(200);
      expect(correctMessage).toEqual("You are now logged in!");
    });

    it("POST / should respond that the login has failed when username or password are incorrect", async () => {
      const incorrectTrainer = {
        username: "ash2",
        password: "iWannaB3DVeryBe"
      };
      const { body: incorrectMessage } = await request(app)
        .post("/trainers/login")
        .send(incorrectTrainer)
        .expect(400);
      expect(incorrectMessage).toEqual({"error": "Login Failed"});
    });
  });
});
//test trainer

//test login

//test logout
