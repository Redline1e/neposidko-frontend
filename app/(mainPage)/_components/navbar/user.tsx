import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export const User = () => {
  return (
    <div className="relative">
      <Link href={`/user`}>
        <Avatar>
          <AvatarImage src="./user.png" className="object-cover" />
          <AvatarFallback className="flex justify-center items-center animate-spin">
            <Loader2 />
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
};
