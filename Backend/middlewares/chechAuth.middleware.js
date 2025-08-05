// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { User } from '../models/ecommerce/user.models.js';

export const protect = async (req, res, next) => {
  try {
    const secret="secret";
    const token = req.headers.authorization?.split(" ")[1]; // Format: "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
