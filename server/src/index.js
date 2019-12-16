require("dotenv/config");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");

const fakeDB = require("./fakeDB.js");
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
} = require("./tokens.js");
const { isAuth } = require("./isAuth.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Register a user
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = fakeDB.find(user => user.email === email);
    if (user) throw new Error("User already exist");

    const hashedPassword = await hash(password, 10);
    fakeDB.push({
      id: fakeDB.length,
      email,
      password: hashedPassword
    });

    const createdUser = fakeDB.find(user => user.email === email);
    const accesstoken = createAccessToken(createdUser.id);
    const refreshtoken = createRefreshToken(createdUser.id);

    createdUser.refreshtoken = refreshtoken;

    sendRefreshToken(res, refreshtoken);
    sendAccessToken(res, req, accesstoken);
  } catch (err) {
    res.send({ error: err.message });
  }
});

// Login a user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = fakeDB.find(user => user.email === email);
    if (!user) throw new Error("User does not exist");

    const valid = await compare(password, user.password);
    if (!valid) throw new Error("Password not correct");

    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);

    user.refreshtoken = refreshtoken;

    sendRefreshToken(res, refreshtoken);
    sendAccessToken(res, req, accesstoken);
  } catch (err) {
    res.send({ error: err.message });
  }
});

// Logout a user
app.post("/logout", (req, res) => {
  res.clearCookie("refreshtoken", { path: "/refresh_token" });
  return res.send({ message: "Logged Out" });
});

// Protected route
app.post("/protected", (req, res) => {
  try {
    const userId = isAuth(req);
    if (userId !== null) res.send({ data: "This is protected data.." });
  } catch (err) {
    res.send({ error: err.message });
  }
});

// New accesstoken with refresh token
app.post("/refresh_token", (req, res) => {
  const token = req.cookies.refreshtoken;
  if (!token) return res.send({ accesstoken: "" });

  let payload = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.send({ accesstoken: "" });
  }
  const user = fakeDB.find(user => user.id === payload.userId);
  if (!user) return res.send({ accesstoken: "" });

  if (user.refreshtoken !== token) return res.send({ accesstoken: "" });
  const accesstoken = createAccessToken(user.id);
  const refreshtoken = createRefreshToken(user.id);

  user.refreshtoken = refreshtoken;

  sendRefreshToken(res, refreshtoken);
  sendAccessToken(res, req, accesstoken);
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
