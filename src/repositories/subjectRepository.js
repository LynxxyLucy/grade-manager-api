import prisma from "../prismaClient.js";
import gradeRepo from "./gradeRepository.js";

class SubjectRepository {
  async findMany({ semesterId }) {
    return await prisma.subject.findMany({
      where: {
        semesterId,
      },
    });
  }

  async findUnique({ id }) {
    return await prisma.subject.findUnique({
      where: {
        id,
      },
    });
  }

  async findUniqueWithGrades({ id }) {
    try {
      const subject = await this.findUnique({ id });
      const grades = await gradeRepo.findMany({ id });
      subject.grades = grades;
      return subject;
    } catch {
      return null;
    }
  }

  async create({ name, semesterId }) {
    return await prisma.subject.create({
      data: {
        name,
        semesterId,
      },
    });
  }

  async update({ id, name }) {
    return await prisma.subject.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  async deleteMany({ id }) {
    return await prisma.subject.deleteMany({
      where: {
        id,
      },
    });
  }
}

export default new SubjectRepository();
