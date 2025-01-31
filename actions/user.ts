import { NextResponse } from "next/server";
import { createUser } from "@/lib/user-service";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Всі поля є обов'язковими" }, { status: 400 });
    }

    // Визначаємо roleId за email
    const roleId = email.endsWith("@admin.com") ? 1 : 2;

    const user = await createUser(name, email, password, roleId);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Помилка створення користувача:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
