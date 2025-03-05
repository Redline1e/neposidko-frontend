import { CircleUserRound } from "lucide-react";
import Link from "next/link";

export const User = () => {
  return (
    <div className="relative">
      <Link href="/user">
        <CircleUserRound size={30} />
      </Link>
    </div>
  );
};
