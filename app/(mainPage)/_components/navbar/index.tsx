import { Logo } from "./logo";
import { Search } from "./search";
import { Actions } from "./actions";
import { User } from "./user";

export const Navbar = () => {
  return (
    <nav className="w-full h-20 bg-[#ffffff] px-2 lg:px-4 flex justify-between items-center shadow-sm border-b border-neutral-700/10">
      <Logo />
      <Search />
      <div className="flex">
        <Actions />
        <User />
      </div>
    </nav>
  );
};
