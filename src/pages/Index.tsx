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
    <div className="min-h-screen bg-gradient-to-b from-sage/5 to-cream">
      {/* Header */}
      <header className="border-b border-sage/10">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-sage-dark">VeganJobs</h1>
          <div className="flex gap-4">
            <Button variant="ghost">Log in</Button>
            <Button className="bg-sage hover:bg-sage-dark">Post a job</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div 
        className="relative bg-center bg-cover min-h-[500px] flex items-center" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2400&q=80")',
          backgroundPosition: 'center 40%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sage-dark/80 to-sage/40" />
        <div className="container relative z-10 text-center text-white">
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">
              Find Your Next <span className="text-cream">Vegan Career</span>
            </h2>
            <p className="text-3xl font-light">
              Join the plant-based <span className="text-cream">revolution</span>
            </p>
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
              <Button variant="outline" className="border-sage hover:bg-sage/10">
                Sort by: Latest
              </Button>
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