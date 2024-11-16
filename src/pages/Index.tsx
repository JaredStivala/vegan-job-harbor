import { SearchBar } from "@/components/SearchBar";
import { JobFilters } from "@/components/JobFilters";
import { JobCard } from "@/components/JobCard";

const MOCK_JOBS = [
  {
    title: "Vegan Chef",
    company: "Green Kitchen",
    location: "New York, NY",
    type: "Full-time",
    posted: "2 days ago",
    source: "Indeed",
  },
  {
    title: "Plant-Based Food Scientist",
    company: "VegTech Solutions",
    location: "Remote",
    type: "Full-time",
    posted: "1 week ago",
    source: "LinkedIn",
  },
  {
    title: "Vegan Restaurant Manager",
    company: "Pure Food",
    location: "Los Angeles, CA",
    type: "Full-time",
    posted: "3 days ago",
    source: "VegJobs",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Hero Section */}
      <div className="bg-sage/5 border-b border-sage/10">
        <div className="container py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-sage-dark mb-6">
            Find Your Dream Vegan Job
          </h1>
          <p className="text-sage text-lg mb-8 max-w-2xl mx-auto">
            Discover opportunities that align with your values. We aggregate vegan jobs from across the web to help you make a difference.
          </p>
          <SearchBar />
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <JobFilters />
          
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-sage-dark">
                Latest Jobs
              </h2>
              <span className="text-sage">
                {MOCK_JOBS.length} jobs found
              </span>
            </div>
            
            {MOCK_JOBS.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;