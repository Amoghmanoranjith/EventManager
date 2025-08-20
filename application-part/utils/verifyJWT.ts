import jwt from "jsonwebtoken";
import { customError } from "./customError";

// will decode any valid token
export function verifyJWT(token: string): any {
  if (!process.env.JWT_SECRET_KEY) {
    throw new customError("env variable not found", "jwt_secret_not_found")
}

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return {decoded, status:200};
} catch (err) {
    throw new customError("given jwt is invalid", "invalid_jwt")
  }
}
