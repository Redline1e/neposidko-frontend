import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "@/services/user-service";
import { getConnection } from "typeorm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не дозволено" });
  }

  const { name, email, password, roleId } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Всі поля (name, email, password) обов'язкові" });
  }

  try {
    await getConnection(); // Переконуємось, що з'єднання з БД активне
    const newUser = await createUser(name, email, password, roleId);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}
