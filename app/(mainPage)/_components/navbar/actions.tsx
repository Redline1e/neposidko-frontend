import Link from "next/link";

const actionLinks = [
  { name: "Головна", href: "/" },
  { name: "Товари", href: "/products" },
  { name: "Контакти", href: "/contact" },
];

export const Actions = () => {
  return (
    <ul className="flex items-center justify-between">
      {actionLinks.map((link, index) => (
        <li key={index}>
          <Link href={link.href}>{link.name}</Link>
        </li>
      ))}
    </ul>
  );
};
