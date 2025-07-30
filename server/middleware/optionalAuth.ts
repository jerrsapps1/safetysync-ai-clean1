import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      (req as any).user = decoded; // Attach decoded token to request object
    } catch (err) {
      // Token invalid but continue without authentication
      (req as any).user = null;
    }
  } else {
    (req as any).user = null;
  }
  
  next();
};

export default optionalAuth;