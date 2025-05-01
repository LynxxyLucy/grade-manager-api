import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// Get all subjects of a semester
router.get("/", async (req, res) => {
  const { semesterId } = req.query; // Get semesterId from query parameters

  try {
    const subjects = await prisma.subject.findMany({
      where: {
        semesterId,
      },
    });

    res.status(200).json(subjects); // Send the subjects in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Get a specific subject by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const subject = await prisma.subject.findUnique({
      where: {
        id,
      },
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found." }); // Not Found
    }

    const grades = await prisma.grade.findMany({
      where: {
        subjectId: id,
      },
    });
    
    subject.grades = grades; // Add grades to the subject object

    res.status(200).json(subject); // Send the subject in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Create a new subject for a year
router.post("/", async (req, res) => {
  const { semesterId, name } = req.body; // Get semesterId and subject from request body

  try {
    const newSubject = await prisma.subject.create({
      data: {
        name,
        semesterId,
      },
    });

    res.status(201).json({ message: "Subject created.", newSubject }); // Send the new subject in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Update a specific subject by id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedSubject = await prisma.subject.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    res.status(200).json({ message: "Subject updated.", updatedSubject }); // Send the updated subject in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

// Delete a specific subject by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSubject = await prisma.subject.deleteMany({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Subject deleted.", deletedSubject }); // Send the deleted subject in the response
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500).json({ message: error.message }); // Internal Server Error
  }
});

export default router;
