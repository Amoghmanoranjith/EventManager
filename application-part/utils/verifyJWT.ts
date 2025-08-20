import jwt from "jsonwebtoken";

// will decode any valid token
export function verifyJWT(token: string): any {
  if (!process.env.JWT_SECRET_KEY) {
    return {error:"env variable not found", status:500}
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return {decoded, status:200};
  } catch (err) {
    return {error: "Invalid or expired jwt", status:401}
  }
}

