import { database, events, crudy, mutations } from "crudit";
import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());



// configure settings
crudy.config(function (config) {
  config.settings.database.name = "test";
  config.settings.database.roles = ["owner"];
  config.settings.database.url = process.env.DBURL;
});

crudy.hook(
  "audit",
  events.beforeSave,
  null,
  null,
  async function (database, db, collection, data, user, config) {
    // console.log("AUDIT");
    //console.log(null,db,collection,data,user,config);
    let username = user ? user.name : "anonymous";
    //console.log("hook triggered");
    data.updatedOn = new Date();
    data.updatedBy = username;

    if (!data._id || data._id == "") {
      data.insertedOn = new Date();
      data.insertedBy = username;
    }
  }
);

crudy.request(
  "login",
  "post",
  false,
  async function (request, loggedUser, settings) {
    let hash = crypto
      .createHash("md5")
      .update(request.body.password)
      .digest("hex");
    let user = await database.search("global", "users", {
      username: request.body.username,
      password: hash,
    });
    if (!user || user.length != 1)
      throw new Error("Wrong username and password");
    user = user[0];
    let newToken = crypto.randomBytes(64).toString("hex");
    let token = { userId: user._id, token: newToken, expireAt: 0 };
    token = await database.insert("global", "tokens", token);
    delete user.password;
    delete user.db;
    user.token = newToken;
    return user;
  }
);

//Custom method for register
crudy.request(
  "register",
  "post",
  false,
  async function (request, loggedUser, settings) {
    let user = request.body;
    delete user.token;
    user.password = crypto
      .createHash("md5")
      .update(user.password)
      .digest("hex");
    user.db = ("c_" + user.username ?? "sdff")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");
    user.active = true;
    user = await database.insert("global", "users", user);
    return user;
  }
);

crudy.request(
  "publish",
  "post",
  true,
  async function(request, loggedUser, settings){
    console.log('get', request, loggedUser, settings);

    return request;
  }
)

crudy.authorize(async function (request) {
  let token = request.headers.authorization ?? request.query.authorization;

  let users = await database.aggregate("global", "users", [
    {
      $lookup: {
        from: "tokens",
        localField: "_id",
        foreignField: "userId",
        as: "token",
      },
    },
    {
      $match: {
        "token.token": token,
      },
    },
  ]);
  if (users == null || users.length != 1) return null;
  let user = users[0];
  return {
    name: user.name,
    roles: ["owner"],
    database: user.db,
  };
});

app.all("/api/handler", async (request, response) => {
  let result = await crudy.run(request, response);
  return result;
});

app.listen(port, () => {
  console.log(`Crudy Demo listening on port ${port}`);
});
