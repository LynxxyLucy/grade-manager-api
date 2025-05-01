import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

// Get all semesters of a user
router.get("/", async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters

  try {
    const semesters = await prisma.semester.findMany({
      where: {
        userId,
      },
    });

    res.status(200).json(semesters); // Send the semesters in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Create a new semester for a user
router.post("/", async (req, res) => {
  const { userId, semester } = req.body; // Get userId and semester from request body

  try {
    const newSemester = await prisma.semester.create({
      data: {
        semester: semester.toString(), // Convert semester to string
        userId,
      },
    });

    res.status(201).json({ message: "Semester created.", newSemester }); // Send the new semester in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Get a specific semester for a user
router.get("/semester", async (req, res) => {
  const { userId } = req.body; // Get userId from query parameters
  console.log(req.body.semester);

  try {
    const getSemester = await prisma.semester.findMany({
      where: {
        semester: { contains: req.body.semester }, // Find semesters that contain the string
        userId,
      },
    });

    if (!getSemester) {
      return res.status(404).json({ message: "Semester not found." }); // Not Found
    }

    res.status(200).json(getSemester); // Send the semester in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Update a semester for a user
router.put("/:id", async (req, res) => {
  const { id } = req.params; // Get semesterId from request parameters
  const { userId } = req.query; // Get userId from query parameters
  const { semester } = req.body; // Get semester from request body

  try {
    const updatedSemester = await prisma.semester.update({
      where: {
        id,
        userId,
      },
      data: {
        semester,
      },
    });

    res.status(200).json({ message: "Semester updated", updatedSemester }); // Send the updated semester in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Delete a semester for a user
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Get semesterId from request parameters
  const { userId } = req.query; // Get userId from query parameters

  try {
    await prisma.semester.delete({
      where: {
        id,
        userId,
      },
    });

    res.sendStatus(204).json({ message: "Semester deleted." }); // No Content
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

export default router;
