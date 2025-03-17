import { CircleUserRound } from "lucide-react";
import Link from "next/link";

export const User = () => {
  return (
    <div className="relative">
      <Link href="/user" aria-label="Користувач">
        <CircleUserRound
          size={30}
          className="text-neutral-700 hover:text-neutral-500 transition-colors duration-200"
        />
      </Link>
    </div>
  );
};
