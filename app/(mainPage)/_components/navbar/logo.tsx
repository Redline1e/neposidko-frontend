import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hidden items-center lg:flex">
        <Image src="/logo.png" alt="logo" height={28} width={200} />
      </div>
    </Link>
  );
};
