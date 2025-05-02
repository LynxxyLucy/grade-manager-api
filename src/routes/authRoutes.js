import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js"; // Import the Prisma client
import repo from "../repositories/authRepository.js"; // Import the repository

const router = express.Router();

/*
 * Register a new user
 */
router.post("/register", async (req, res) => {
  const { name, email, username, password } = req.body; // destructure request body
  console.log(req.body);

  try {
    // Check if the user already exists
    //const identifier = email ? { email } : { username }; // Use email or username to find the user

    const findUsername = await repo.findUniqueByUsername({ username });
    if (findUsername) {
      return res.status(400).json({ message: "Username already exists." }); // Bad Request
    }

    const findEmail = await repo.findUniqueByEmail({ email });
    if (findEmail) {
      return res.status(400).json({ message: "Email already registered." }); // Bad Request
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 16);

    // Create a new user
    const newUser = await repo.createUser({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // Generate a JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Send the token and user data in the response
    res.status(201).json({
      token,
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500); // Internal Server Error
  }
});

/*
 * Login a user
 */
router.post("/login", async (req, res) => {
  // Destructure request body
  const { email, username, password } = req.body;

  try {
    // Check if the user exists
    const identifier = email ? { email } : { username }; // Use email or username to find the user
    const user = await repo.findUniqueByIdentifier({ identifier });

    // If user not found, return error
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password with the hashed password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Send the token and user data in the response
    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500); // Internal Server Error
  }
});

/*
 * DELETE a user
 */
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params; // Get userId from request parameters

  try {
    // Delete the user
    await repo.deleteUser({ id });

    res.sendStatus(204); // No Content
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500); // Internal Server Error
  }
});

export default router;
