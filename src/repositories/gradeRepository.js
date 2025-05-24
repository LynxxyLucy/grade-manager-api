import prisma from "../prismaClient.js";

class GradeRepository {
  async getAllForSubject({ subjectId }) {
    return await prisma.grade.findMany({
      where: {
        subjectId,
      },
    });
  }

  async checkSubjectExistance({ subjectId }) {
    return await prisma.subject.findUnique({
      where: {
        id: subjectId,
      },
    });
  }

  async create({ subjectId, grade, type, date }) {
    return await prisma.grade.create({
      data: {
        subjectId,
        grade,
        type,
        date,
      },
    });
  }

  async update({ id, grade, type, date }) {
    return await prisma.grade.update({
      where: {
        id,
      },
      data: {
        grade,
        type,
        date,
      },
    });
  }

  async deleteMany({ id }) {
    return await prisma.grade.delete({
      where: {
        id,
      },
    });
  }
}

export default new GradeRepository();
