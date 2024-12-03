import { CategorizedTags } from "./CategorizedTags";
import { Command } from "cmdk";
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  tags: string[];
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
}

export const SearchBar = ({ tags, onTagSelect, selectedTags }: SearchBarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-sage" />
        <button
          onClick={() => setOpen(true)}
          className="w-full px-6 py-4 pl-14 text-lg rounded-full border-2 border-sage focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all bg-white shadow-lg text-left text-muted-foreground group"
        >
          <div className="flex items-center justify-center gap-2 text-sage">
            <span>Discover Vegan Jobs</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>
        </button>
      </div>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search"
        className="fixed top-[50%] left-[50%] max-w-2xl w-full translate-x-[-50%] translate-y-[-50%] bg-white rounded-xl shadow-2xl border border-sage/10 p-4 animate-in fade-in-0 zoom-in-95"
      >
        <CategorizedTags
          onTagSelect={(tag) => {
            onTagSelect(tag);
            setOpen(false);
          }}
          selectedTags={selectedTags}
        />
      </Command.Dialog>
    </div>
  );
};