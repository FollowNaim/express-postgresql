import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const createUser = async (name: string, email: string, password: string) => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
        INSERT INTO users(name, email, password) VALUES($1, $2, $3) 
        RETURNING*`,
    [name, email, encryptedPassword]
  );
  return result;
};

const getUsers = async () => {
  const result = await pool.query(
    `
      SELECT * FROM users
      `
  );

  return result;
};

const getSpecifiedUser = async (id: string | undefined) => {
  const result = await pool.query(
    `
      SELECT * FROM users WHERE id=$1
      `,
    [id]
  );
  return result;
};

const updateUser = async (name: string, id: string | undefined) => {
  const result = await pool.query(
    `
      UPDATE users SET name=$1 WHERE id=$2 RETURNING *
      `,
    [name, id]
  );

  return result;
};

const deleteUser = async (id: string | undefined) => {
  await pool.query(
    `
      DELETE FROM users WHERE id=$1
      `,
    [id]
  );
};
export const UserServices = {
  createUser,
  getUsers,
  getSpecifiedUser,
  updateUser,
  deleteUser,
};
