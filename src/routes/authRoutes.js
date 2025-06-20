import express from "express";
import service from "../services/authService.js";
import {
  ConflictError,
  InvalidError,
  NotFoundError,
} from "../utils/customErrors.js";
import { registerSchema } from "../utils/userSchemas.js";

const router = express.Router();

// MARK: FIND ALL
router.get("/", async (req, res) => {
  try {
    const allUsers = await service.findAllUsers();
    return res.status(200).json(allUsers);
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
});

// MARK:  REGISTER
router.post("/register", async (req, res) => {
  console.log(req.body);

  try {
    // Validate Input
    const { error: e, value: v } = registerSchema.validate(req.body);
    if (e) {
      throw new InvalidError(e);
    }

    const newUser = await service.registerUser(
      v.name,
      v.email,
      v.username,
      v.password
    );
    return res.status(201).json({ message: "New user created.", newUser });
  } catch (error) {
    console.log(error);
    if (error instanceof ConflictError || InvalidError) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message }); // Internal Server Error
  }
});

// MARK:  LOGIN
router.post("/login", async (req, res) => {
  // Destructure request body
  const { email, username, password } = req.body;

  try {
    const login = await service.loginUser(email, username, password);
    return res.status(200).json({ message: "Login succesful!", login });
  } catch (error) {
    console.log(error.message);
    if (error instanceof InvalidError) {
      return res.status(400).json({ error: error.message }); // Bad Request
    }
    return res.status(500).json({ error: error.message }); // Internal Server Error
  }
});

// MARK:  DELETE
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params; // Get userId from request parameters

  try {
    // Delete the user
    const toDelete = await service.deleteUser(id);
    res.status(200).json({ message: `User '${toDelete.username}' deleted.` }); // No Content
  } catch (error) {
    console.log(error.message);
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    return res.sendStatus(500); // Internal Server Error
  }
});

export default router;
