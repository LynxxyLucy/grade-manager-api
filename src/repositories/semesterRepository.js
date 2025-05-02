import prisma from "../prismaClient.js";
import subjectRepo from "./subjectRepository.js";

class SemesterRepository {
  async findManySearch({ search, userId }) {
    return await prisma.semester.findMany({
      where: {
        semester: { contains: search }, // Find semesters that contain the string
        userId,
      },
    });
  }

  async findMany({ userId }) {
    return await prisma.semester.findMany({
      where: {
        userId,
      },
    });
  }

  async findUnique({ id }) {
    return await prisma.semester.findUnique({
      where: {
        id,
      },
    });
  }

  async findUniqueWithSubjects({ id }) {
    try {
      const semester = await this.findUnique({ id });
      const subjects = await subjectRepo.findMany({ id });
      semester.subjects = subjects;
      return semester;
    } catch {
      return null;
    }
  }

  async create({ userId, semester }) {
    return await prisma.semester.create({
      data: {
        semester: semester.toString(), // Convert semester to string
        userId,
      },
    });
  }

  async update({ id, userId, semester }) {
    return await prisma.semester.update({
      where: {
        id,
        userId,
      },
      data: {
        semester,
      },
    });
  }

  async deleteMany({ id, userId }) {
    return await prisma.semester.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}

export default new SemesterRepository();
