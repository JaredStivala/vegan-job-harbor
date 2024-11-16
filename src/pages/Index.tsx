import { SearchBar } from "@/components/SearchBar";
import { JobFilters } from "@/components/JobFilters";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";

const MOCK_JOBS = [
  {
    title: "Vegan Chef",
    company: "Green Kitchen",
    location: "Worldwide",
    type: "Full-time",
    salary: "$50k - $70k",
    posted: "2d ago",
    tags: ["Food Service", "Cooking"],
    verified: true,
  },
  {
    title: "Plant-Based Food Scientist",
    company: "VegTech Solutions",
    location: "Remote",
    type: "Full-time",
    salary: "$80k - $120k",
    posted: "1d ago",
    tags: ["Research", "Food Science"],
    verified: true,
  },
  {
    title: "Vegan Restaurant Manager",
    company: "Pure Food",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$60k - $80k",
    posted: "3d ago",
    tags: ["Management", "Food Service"],
    verified: false,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sage/5">
      {/* Header */}
      <header className="border-b border-sage/10">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-sage-dark">VeganJobs</h1>
          <div className="flex gap-4">
            <Button variant="ghost">Health Insurance</Button>
            <Button variant="ghost">Log in</Button>
            <Button className="bg-red-500 hover:bg-red-600">Post a job</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-center bg-cover min-h-[500px] flex items-center" style={{ backgroundImage: 'url("/placeholder.svg")' }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative z-10 text-center text-white">
          <h2 className="text-5xl font-bold mb-4">
            find a <span className="text-sage">vegan job</span>
          </h2>
          <p className="text-3xl font-light mb-8">
            work from <span className="text-sage">anywhere</span>
          </p>
          <SearchBar />
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="border-y border-sage/10 bg-white/50 py-8">
        <div className="container">
          <p className="text-center text-sage mb-6">Trusted by leading companies</p>
          <div className="flex justify-center items-center gap-8 opacity-50">
            {/* Add company logos here */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <JobFilters />
          
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-sage-dark">Latest Jobs</h2>
                <span className="text-sage bg-sage/10 px-2 py-1 rounded-full text-sm">
                  {MOCK_JOBS.length}
                </span>
              </div>
              <Button variant="outline">Sort by: Latest</Button>
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