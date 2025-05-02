import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import repo from "../repositories/authRepository.js";

class AuthService {
  hashPass(password) {
    return bcrypt.hashSync(password, 16);
  }

  validatePass(password, user) {
    return bcrypt.compareSync(password, user.password);
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  }
}

export default new AuthService();
