import { JobsContent } from "@/components/jobs/JobsContent";
import { JobsHeader } from "@/components/jobs/JobsHeader";
import { JobsHero } from "@/components/jobs/JobsHero";
import { PostJobButton } from "@/components/PostJobButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sage/5 to-cream">
      <JobsHero />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <JobsHeader />
          <PostJobButton />
        </div>
        <JobsContent />
      </div>
    </div>
  );
};

export default Index;