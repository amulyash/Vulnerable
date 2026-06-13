const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


const USER = {
  username: "admin",
  password: "1234"
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    return res.json({ success: true, message: "Login successful!" });
  } else {
    return res.json({ success: false, message: "Invalid credentials" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());


let users = [
  { email: "user@test.com", password: "1234", resetToken: null, tokenExpiry: null }
];

// 1. Request password reset
app.post("/request-reset", (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.json({ message: "User not found" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

  // In real app → send via email
  return res.json({
    message: "Reset link generated",
    resetLink: `http://localhost:5500/reset.html?token=${token}`
  });
});

// 2. Reset password
app.post("/reset-password", (req, res) => {
  const { token, newPassword } = req.body;

  const user = users.find(u => u.resetToken === token);

  if (!user || user.tokenExpiry < Date.now()) {
    return res.json({ message: "Invalid or expired token" });
  }

  user.password = newPassword;
  user.resetToken = null;
  user.tokenExpiry = null;

  return res.json({ message: "Password reset successful" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});