// Import the Express.js module
const express = require("express");

// Create an instance of Express
const app = express();

const jwt = require("jsonwebtoken");

const fs = require("fs");
const fakeLocal = require("./fake.local.json");

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Define a route for GET /createToken
app.get("/createToken", async (req, res) => {
  let user = { name: "kanta", favColor: "red", id: "123" };

  const token = jwt.sign({ user }, "TOP_SECRET_KEY");
  await fs.writeFile(
    "fake.local.json",
    JSON.stringify({ Authorization: `Bearer ${token}` }),
    (err) => {
      if (err) throw err;
    }
  );
  res.send("Token created successfully!");
});

app.get("/profile", async (req, res) => {
  console.log(fakeLocal.Authorization);
  const result = await await jwt.verify(
    fakeLocal.Authorization.substring(7),
    "TOP_SECRET_KEY"
  );
  result.message = "aaa";
  console.log("result :", result);

  res.json(result);
});

app.get("/incorrect", async (req, res) => {
  try {
    await jwt.verify(fakeLocal.Authorization.substring(7), "TOP_SECREttttt");
  } catch (error) {
    console.log(error);
    return res.status(400).send("token invalid");
  }
  res.send("ssss");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
