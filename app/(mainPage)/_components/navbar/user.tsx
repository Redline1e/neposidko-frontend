import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

export const User = () => {
  return (
    <div className="relative">
      <Link href={`/`}>
        <Avatar>
          <AvatarImage src="./user.png" className="object-cover" />
          {/* <AvatarFallback></AvatarFallback> */}
        </Avatar>
      </Link>
    </div>
  );
};
