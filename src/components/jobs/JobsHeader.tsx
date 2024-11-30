import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const JobsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="absolute top-4 right-4 z-20">
      <Button 
        onClick={() => navigate("/post-job")}
        className="bg-sage hover:bg-sage-dark text-white"
      >
        Post a Job
      </Button>
    </div>
  );
};