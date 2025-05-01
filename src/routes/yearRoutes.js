import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

// Get all years of a user
router.get("/", async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters

  try {
    const years = await prisma.year.findMany({
      where: {
        userId,
      },
    });

    res.status(200).json(years); // Send the years in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Create a new year for a user
router.post("/", async (req, res) => {
  const { userId, year } = req.body; // Get userId and year from request body

  try {
    const newYear = await prisma.year.create({
      data: {
        year: year.toString(), // Convert year to string
        userId,
      },
    });

    res.status(201).json({ message: "Year created.", newYear }); // Send the new year in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Get a specific year for a user
router.get("/year", async (req, res) => {
  const { userId } = req.body; // Get userId from query parameters
  console.log(req.body.year);

  try {
    const getYear = await prisma.year.findMany({
      where: {
        year: { contains: req.body.year }, // Find year by identifier
        userId,
      },
    });

    if (!getYear) {
      return res.status(404).json({ message: "Year not found." }); // Not Found
    }

    res.status(200).json(getYear); // Send the year in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Update a year for a user
router.put("/:id", async (req, res) => {
  const { id } = req.params; // Get yearId from request parameters
  const { userId } = req.query; // Get userId from query parameters
  const { year } = req.body; // Get year from request body

  try {
    const updatedYear = await prisma.year.update({
      where: {
        id,
        userId,
      },
      data: {
        year,
      },
    });

    res.status(200).json({ message: "Year updated", updatedYear }); // Send the updated year in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Delete a year for a user
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Get yearId from request parameters
  const { userId } = req.query; // Get userId from query parameters

  try {
    await prisma.year.delete({
      where: {
        id,
        userId,
      },
    });

    res.sendStatus(204).json({ message: "Year deleted." }); // No Content
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

export default router;
