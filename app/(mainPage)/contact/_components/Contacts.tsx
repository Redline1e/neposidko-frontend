import React from "react";
import { Mail, Phone, Pin } from "lucide-react";
import Head from "next/head";

interface ContactsProps {
  children: React.ReactNode;
}

const Contacts: React.FC<ContactsProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Контакти - Непосидько</title>
        <meta
          name="description"
          content="Зв’яжіться з нами! Інтернет-магазин дитячого взуття Непосидько: адреса, телефон, email. Доставка по Україні."
        />
        <meta
          name="keywords"
          content="контакти, Непосидько, дитяче взуття, телефон, email"
        />
        <link rel="canonical" href="https://www.neposidko.com/contact" />
      </Head>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Контакти</h1>
        <p className="text-lg text-neutral-700 mb-4">
          Ви можете зв’язатися з нами за наступними контактами:
        </p>
        <ul className="text-lg text-neutral-700 space-y-2 mb-6">
          <li className="flex items-center gap-3">
            <Pin /> Адреса: м.Охтирка, вул. Паркова, 38
          </li>
          <li className="flex items-center gap-3">
            <Phone /> Телефон: +38 (050) 800-30-88
          </li>
          <li className="flex items-center gap-3">
            <Mail /> Email: neposidko@ukr.net
          </li>
        </ul>
        <div className="mt-8">{children}</div>
      </div>
    </>
  );
};

export default Contacts;
