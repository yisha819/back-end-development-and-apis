import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findByUsername } from "../utils/db.js";
import { JWT_SECRET } from "../middleware/authenticate.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  const user = findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  // Replace passwordHash with the real key from data/users.json
  const hash = user.passwordHash;

  const valid = hash ? await bcrypt.compare(password, hash) : false;
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.status(200).json({ token });
});

export default router;