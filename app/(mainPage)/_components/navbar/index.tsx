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

// export const NavbarSkeleton = () => {
//   return (
//     <nav className="fixed top-0 w-full h-20 z-[49] bg-[#ffffff] px-2 lg:px-4 flex justify-between items-center shadow-sm border-b border-orange-600/30">
//       {/* Logo Skeleton */}
//       <div className="w-24 h-6">
//         <Skeleton className="w-full h-full" />
//       </div>

//       {/* Search Skeleton */}
//       <div className="w-40 lg:w-60">
//         <Skeleton className="w-full h-10" />
//       </div>

//       {/* Actions and User Skeleton */}
//       <div className="flex gap-4">
//         <ActionSkeleton />

//         {/* User Skeleton */}
//         <div className="w-12 h-12 rounded-full">
//           <Skeleton className="w-full h-full rounded-full" />
//         </div>
//       </div>
//     </nav>
//   );
// };
