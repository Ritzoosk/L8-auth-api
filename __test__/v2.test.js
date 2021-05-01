"use strict";

const supergoose = require("@code-fellows/supergoose");
const { server } = require("../src/server");
const mockReq = supergoose(server);
// const bearerMid = require("../src/middleware/bearer.js")
// const aclMid = require("../src/middleware/acl.js")
// const User = require("../src/models/users.js")

process.env.SECRET = "bird";


describe("API SERVER TEST V2: ", () => {
  // console.log(adminUser);
  var foodTest = { name: "test1", calories: 999999  };
    it("404 on a bad route", async () => {
      let res = await mockReq.get("/foo");
      expect(res.status).toEqual(404);
    });

    it("404 on a bad method", async () => {
      let res = await mockReq.post("/");
      expect(res.status).toEqual(404);
    });

  it("Should create a record using POST", async () => {
    const adminUser = await mockReq.post('/signup').send( {username: "test", password: "1234", role: "admin"});

    let res = await mockReq.post("/api/v2/food").send(foodTest).auth(adminUser.body.token, {type: 'bearer'});
    expect(res.status).toEqual(201);
    expect(res.body.name).toEqual(foodTest.name);
    expect(res.body.calories).toEqual(foodTest.calories);
  });

  it("Should read a record using GET", async () => {
    const adminUser = await mockReq.post('/signup').send( {username: "test2", password: "1234", role: "admin"});

    let newFood = await mockReq.post("/api/v2/food").send(foodTest).auth(adminUser.body.token, {type: 'bearer'});
    let id = newFood.body._id;
    let res = await mockReq.get(`/api/v2/food/${id}`).auth(adminUser.body.token, {type: 'bearer'});
    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual(foodTest.name);
    expect(res.body.calories).toEqual(foodTest.calories);
  });

  it("Should read a list of record using GET", async () => {
    const adminUser = await mockReq.post('/signup').send( {username: "test3", password: "1234", role: "admin"});

    let res = await mockReq.get("/api/v2/food").auth(adminUser.body.token, {type: 'bearer'});
    console.log("getAll", res.body);
    expect(res.status).toEqual(200);
  });

  it("Should update a record using PUT", async () => {
    const adminUser = await mockReq.post('/signup').send( {username: "test4", password: "1234", role: "admin"});

    let newRecord = { name: "test99", calories: 0 };
    let oldFood = await mockReq.post("/api/v2/food").send(foodTest).auth(adminUser.body.token, {type: 'bearer'});
    let id = oldFood.body._id;
    let res = await mockReq.put(`/api/v2/food/${id}`).send(newRecord).auth(adminUser.body.token, {type: 'bearer'});
    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual(newRecord.name);
    expect(res.body.calories).toEqual(newRecord.calories);
  });

  it("Should update a record using DELETE", async () => {
    const adminUser = await mockReq.post('/signup').send( {username: "test5", password: "1234", role: "admin"});

    let newFood = await mockReq.post("/api/v2/food").send(foodTest).auth(adminUser.body.token, {type: 'bearer'});
    let id = newFood.body._id;
    let res = await mockReq.delete(`/api/v2/food/${id}`).auth(adminUser.body.token, {type: 'bearer'});
    expect(res.status).toEqual(200);
    let getResponse = await mockReq.get(`/api/v2/food/${id}`).auth(adminUser.body.token, {type: 'bearer'});
    // console.log(getResponse.body)
    expect(getResponse.body).toEqual(null);
  });

  //---------------------------------------------------------------------------------


  it("Should fail to create a record using POST", async () => {
    const user = await mockReq.post('/signup').send( {username: "test6", password: "1234", role: "user"});

    let res = await mockReq.post("/api/v2/food").send(foodTest).auth(user.body.token, {type: 'bearer'});
    expect(res.status).toEqual(500);
    expect(res.body.message).toEqual("Access Denied");
  });


  // it("Should fail to update a record using PUT", async () => {
  //   const user = await mockReq.post('/signup').send( {username: "test7", password: "1234", role: "user"});

  //   let newRecord = { name: "test99", calories: 0 };
  //   let oldFood = await mockReq.post("/api/v2/food").send(foodTest).auth(user.body.token, {type: 'bearer'});
  //   let id = oldFood.body._id;
  //   let res = await mockReq.put(`/api/v2/food/${id}`).send(newRecord).auth(user.body.token, {type: 'bearer'});
  //   expect(res.status).toEqual(500);
  //   expect(res.body.name).toEqual(newRecord.name);
  //   expect(res.body.calories).toEqual(newRecord.calories);
  // });

  // it("Should fail to update a record using DELETE", async () => {
  //   const user = await mockReq.post('/signup').send( {username: "test8", password: "1234", role: "user"});

  //   let newFood = await mockReq.post("/api/v2/food").send(foodTest).auth(user.body.token, {type: 'bearer'});
  //   let id = newFood.body._id;
  //   let res = await mockReq.delete(`/api/v2/food/${id}`).auth(user.body.token, {type: 'bearer'});
  //   expect(res.status).toEqual(500);
  //   let getResponse = await mockReq.get(`/api/v2/food/${id}`).auth(user.body.token, {type: 'bearer'});
  //   // console.log(getResponse.body)
  //   expect(getResponse.body).toEqual('Invalid Login');
  // });

});