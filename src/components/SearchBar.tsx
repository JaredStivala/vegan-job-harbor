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
        className="group flex flex-col items-center justify-center gap-3 text-cream transition-all duration-300 hover:scale-110"
      >
        <span className="text-lg font-light tracking-wide opacity-80 group-hover:opacity-100">
          Explore Opportunities
        </span>
        <div className="relative">
          <ChevronDown className="h-16 w-16 animate-bounce opacity-80 group-hover:opacity-100" strokeWidth={1.5} />
          <div className="absolute inset-0 blur-lg bg-sage/20 rounded-full animate-pulse" />
        </div>
        <span className="sr-only">Scroll to jobs</span>
      </button>
    </div>
  );
};