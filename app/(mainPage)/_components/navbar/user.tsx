import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export const User = () => {
  return (
    <div className="relative">
      <Avatar>
        <AvatarImage src="./public/user.png" className="object-cover" />
        <AvatarFallback></AvatarFallback>
      </Avatar>
    </div>
  );
};
