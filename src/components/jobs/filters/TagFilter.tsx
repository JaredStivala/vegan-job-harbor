import { Tag } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";

interface TagFilterProps {
  tags: string[];
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
}

export const TagFilter = ({ tags, onTagSelect, selectedTags }: TagFilterProps) => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleTagSelect = (tag: string) => {
    onTagSelect(tag);
    setSearchDialogOpen(false);
  };

  return (
    <div className="relative flex-1 sm:w-48">
      <button
        onClick={() => setSearchDialogOpen(true)}
        className="w-full px-4 py-2 pl-10 pr-10 text-sm rounded-md border border-input bg-background text-left"
      >
        {selectedTags.length > 0 ? `${selectedTags.length} tags selected` : "Search tags..."}
      </button>
      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

      <CommandDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Type to search tags..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup heading="Available Tags">
              {tags
                .filter(tag => 
                  tag.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((tag) => (
                  <CommandItem
                    key={tag}
                    value={tag}
                    onSelect={() => handleTagSelect(tag)}
                    className="cursor-pointer"
                  >
                    <Tag className="mr-2 h-4 w-4 text-sage" />
                    <span>{tag}</span>
                    {selectedTags.includes(tag) && (
                      <span className="ml-auto text-sage">Selected</span>
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};