import { Logo } from "./logo";
import { Search } from "./search";
import { Actions } from "./actions";
import { User } from "./user";

export const Navbar = () => {
  return (
    <nav className="w-full h-20 bg-neutral-50 px-4 lg:px-6 flex justify-between items-center shadow-sm border-b border-neutral-200">
      <Logo />
      <Search />
      <div className="flex items-center">
        <Actions />
        <User />
      </div>
    </nav>
  );
};
