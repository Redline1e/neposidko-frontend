import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hidden lg:flex items-center">
        <Image
          src="/logo.png"
          alt="Логотип інтернет-магазину Непосидько"
          height={28}
          width={200}
          className="hover:opacity-80 transition-opacity duration-200"
        />
      </div>
    </Link>
  );
};
