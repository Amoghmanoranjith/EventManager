import jwt from "jsonwebtoken";
// will generate a valid token for given payload
export function genJWT(payload: any): string {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables");
  }
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
}
