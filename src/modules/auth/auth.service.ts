import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db";

const loginUer = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  const user = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email]
  );
  if (!user.rows.length) return null;
  const b = await bcrypt.compare(password, user.rows[0].password);
  if (!b) return false;
  const secret = "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";
  const token = jwt.sign(
    { name: user.rows[0].name, email: user.rows[0].email },
    secret,
    { expiresIn: "2h" }
  );
  return token;
};

export const authServices = {
  loginUer,
};
