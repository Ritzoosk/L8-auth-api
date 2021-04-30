"use strict";

const supergoose = require("@code-fellows/supergoose");
const { server } = require("../src/server");
const mockReq = supergoose(server);


describe("API SERVER TEST: ", () => {
  var foodTest = { name: "test1", calories: 999999 };
    it("404 on a bad route", async () => {
      let res = await mockReq.get("/foo");
      expect(res.status).toEqual(404);
    });

    it("404 on a bad method", async () => {
      let res = await mockReq.post("/");
      expect(res.status).toEqual(404);
    });

  it("Should create a record using POST", async () => {
    let res = await mockReq.post("/api/v1/food").send(foodTest);
    expect(res.status).toEqual(201);
    expect(res.body.name).toEqual(foodTest.name);
    expect(res.body.calories).toEqual(foodTest.calories);
  });

  it("Should read a record using GET", async () => {
    let newFood = await mockReq.post("/api/v1/food").send(foodTest);
    let id = newFood.body._id;
    let res = await mockReq.get(`/api/v1/food/${id}`);
    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual(foodTest.name);
    expect(res.body.calories).toEqual(foodTest.calories);
  });

  it("Should read a list of record using GET", async () => {
    let res = await mockReq.get("/api/v1/food");
    console.log("getAll", res.body);
    expect(res.status).toEqual(200);
  });

  it("Should update a record using PUT", async () => {
    let newRecord = { name: "test99", calories: 0 };
    let oldFood = await mockReq.post("/api/v1/food").send(foodTest);
    let id = oldFood.body._id;
    let res = await mockReq.put(`/api/v1/food/${id}`).send(newRecord);
    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual(newRecord.name);
    expect(res.body.calories).toEqual(newRecord.calories);
  });

  it("Should update a record using DELETE", async () => {
    let newFood = await mockReq.post("/api/v1/food").send(foodTest);
    let id = newFood.body._id;
    let res = await mockReq.delete(`/api/v1/food/${id}`);
    expect(res.status).toEqual(200);
    let getResponse = await mockReq.get(`/api/v1/food/${id}`);
    // console.log(getResponse.body)
    expect(getResponse.body).toEqual(null);
  });
});