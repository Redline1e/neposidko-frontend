import { getRepository } from "typeorm";
import { Users } from "../db/entities/Users";
import { Roles } from "../db/entities/Roles";

export const createUser = async (name: string, email: string, password: string, roleId?: number) => {
  const userRepo = getRepository(Users);
  const roleRepo = getRepository(Roles);

  // Перевіряємо, чи існує користувач із таким email
  const existingUser = await userRepo.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Користувач із таким email вже існує");
  }

  let role: Roles | undefined = undefined;
  if (roleId) {
    const foundRole = await roleRepo.findOne({ where: { roleId } });
    if (!foundRole) {
      throw new Error("Роль не знайдена");
    }
    role = foundRole; // Якщо роль знайдено, присвоюємо її змінній
  }

  // Створюємо нового користувача
  const newUser = userRepo.create({
    name,
    email,
    password, // Пароль у відкритому вигляді (небезпечний у продакшені!)
    role, // Присвоюємо undefined, якщо роль не знайдена або не передана
  });

  // Зберігаємо користувача в базу
  await userRepo.save(newUser);
  return newUser;
};
