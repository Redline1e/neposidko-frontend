import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export const Search = () => {
  return (
    <form
      //   onSubmit={onSubmit}
      className="relative w-full lg:w-[400px] flex items-center"
    >
      <Input
        // value={value}
        // onChange={(e) => setValue(e.target.value)}
        placeholder="Search"
        aria-label="Search"
        className="rounded-r-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
      />
      {/* {value && (
        <X
          className="absolute top-2.5 right-14 h-5 w-5 text-muted-foreground cursor-pointer hover:opacity-75 transition"
          onClick={onClear}
        />
      )} */}
      <Button
        type="submit"
        size="sm"
        variant="secondary"
        className="rounded-l-none"
      >
        <SearchIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
    </form>
  );
};
