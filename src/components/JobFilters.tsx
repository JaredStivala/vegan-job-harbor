import { Button } from "@/components/ui/button";

const categories = ["All", "Food Service", "Tech", "Retail", "Non-Profit"];
const locations = ["Remote", "On-site", "Hybrid"];

export const JobFilters = () => {
  return (
    <div className="flex flex-col gap-6 w-full md:w-64">
      <div>
        <h3 className="font-semibold mb-3 text-sage-dark">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              className="bg-white hover:bg-sage/10"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-3 text-sage-dark">Location Type</h3>
        <div className="flex flex-wrap gap-2">
          {locations.map((location) => (
            <Button
              key={location}
              variant="outline"
              className="bg-white hover:bg-sage/10"
            >
              {location}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};