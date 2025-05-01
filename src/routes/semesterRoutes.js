import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// Get all semesters of a user
router.get("/", async (req, res) => {
  const { userId } = req.body; // Get userId from query parameters
  const { search } = req.query; // Get semester from query parameters

  try {
    if (search) {
      const semesters = await prisma.semester.findMany({
        where: {
          semester: { contains: search }, // Find semesters that contain the string
          userId,
        },
      });

      if (!semesters) {
        return res.status(404).json({ message: "No semesters found." }); // Not Found
      }

      return res.status(200).json(semesters); // Send the semesters in the response
    }

    const semesters = await prisma.semester.findMany({
      where: {
        userId,
      },
    });

    if (!semesters) {
      return res.status(404).json({ message: "No semesters found." }); // Not Found
    }

    res.status(200).json(semesters); // Send the semesters in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Get a specific semester by id
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Get semesterId from request parameters

  try {
    const semester = await prisma.semester.findUnique({
      where: {
        id,
      },
    });

    if (!semester) {
      return res.status(404).json({ message: "Semester not found." }); // Not Found
    }

    const subjects = await prisma.subject.findMany({
      where: {
        semesterId: id,
      },
    });

    semester.subjects = subjects; // Add subjects to the semester object

    res.status(200).json(semester); // Send the semester in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Get semesters by userId and semester name
router.get("/semester", async (req, res) => {
  const { userId } = req.body; // Get userId from query parameters
  const { semester } = req.body; // Get semester from request body
  try {
    const getSemester = await prisma.semester.findMany({
      where: {
        semester: { contains: semester }, // Find semesters that contain the string
        userId,
      },
    });

    res.status(200).json(getSemester); // Send the semester in the response
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
