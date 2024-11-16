import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Search vegan jobs..."
        className="w-full px-6 py-4 pl-14 text-lg rounded-full border-2 border-sage focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all bg-white shadow-lg"
      />
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-sage w-6 h-6" />
    </div>
  );
};