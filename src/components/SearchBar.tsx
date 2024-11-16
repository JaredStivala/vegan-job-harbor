import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="relative w-full max-w-2xl">
      <input
        type="text"
        placeholder="Search vegan jobs..."
        className="w-full px-4 py-3 pl-12 text-lg rounded-lg border border-sage/20 focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all bg-white/80 backdrop-blur-sm"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-dark w-5 h-5" />
    </div>
  );
};