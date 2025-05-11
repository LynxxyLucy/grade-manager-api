import prisma from "../prismaClient.js";

class AuthRepository {
  async findAll() {
    return await prisma.user.findMany();
  }

  async findById({ id }) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findUniqueByUsername({ username }) {
    return await prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findUniqueByEmail({ email }) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUniqueByIdentifier({ identifier }) {
    return await prisma.user.findUnique({
      where: identifier,
    });
  }

  async create({ name, email, username, password }) {
    return await prisma.user.create({
      data: {
        name,
        email,
        username,
        password,
      },
    });
  }

  async delete({ id }) {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }
}

export default new AuthRepository();
