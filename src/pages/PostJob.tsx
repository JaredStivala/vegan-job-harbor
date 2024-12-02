import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { JobPostForm } from "@/components/job-post/JobPostForm";
import { calculateTotalPrice } from "@/config/pricing";

const calculateVerificationEndDate = (verificationPeriod: string): Date | null => {
  if (!verificationPeriod) return null;
  
  const now = new Date();
  switch (verificationPeriod) {
    case "24h":
      return new Date(now.setHours(now.getHours() + 24));
    case "3d":
      return new Date(now.setDate(now.getDate() + 3));
    case "1w":
      return new Date(now.setDate(now.getDate() + 7));
    case "1m":
      return new Date(now.setMonth(now.getMonth() + 1));
    default:
      return null;
  }
};

const PostJob = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationPeriod, setVerificationPeriod] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage/5 to-cream py-12">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-sage-dark mb-2">Post a Job</h1>
          <p className="text-gray-600">
            Share your vegan-friendly job opportunity with our community. All jobs posted here will be put at the top of the page.
          </p>
        </div>

        <JobPostForm
          isSubmitting={isSubmitting}
          isVerified={isVerified}
          verificationPeriod={verificationPeriod}
          setIsVerified={setIsVerified}
          setVerificationPeriod={setVerificationPeriod}
        />
      </div>
    </div>
  );
};

export default PostJob;