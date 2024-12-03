import { ChevronDown } from "lucide-react";

export const SearchBar = () => {
  const scrollToJobs = () => {
    const jobsSection = document.querySelector('#jobs-section');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <button
        onClick={scrollToJobs}
        className="w-full flex items-center justify-center gap-2 text-cream group"
      >
        <ChevronDown className="h-12 w-12 animate-bounce" />
        <span className="sr-only">Scroll to jobs</span>
      </button>
    </div>
  );
};