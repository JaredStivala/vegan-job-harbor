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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const jobData = {
      page_title: String(formData.get("title") || ""),
      company_name: String(formData.get("company") || ""),
      location: String(formData.get("location") || ""),
      salary: String(formData.get("salary") || ""),
      description: String(formData.get("description") || ""),
      url: String(formData.get("url") || ""),
      tags: formData.get("tags")?.toString() || null,
      date_posted: new Date().toISOString().split("T")[0],
      Verified: isVerified,
      verification_end_date: isVerified ? calculateVerificationEndDate(verificationPeriod)?.toISOString() : null,
    };

    try {
      // Calculate total amount
      const amount = calculateTotalPrice(isVerified, verificationPeriod);

      // Create a new job post
      const { data: jobPost, error: jobError } = await supabase
        .from("userSubmissions")
        .insert(jobData)
        .select()
        .single();

      if (jobError) throw jobError;

      // Create a payment record
      const { error: paymentError } = await supabase
        .from("jobPayments")
        .insert({
          job_id: jobPost.id,
          amount,
          status: 'pending',
          payment_type: isVerified ? 'verified_post' : 'basic_post',
          stripe_session_id: 'pending' // This will be updated with the actual Stripe session ID
        });

      if (paymentError) throw paymentError;

      // TODO: Redirect to Stripe payment page
      // For now, we'll just show a success message
      toast({
        title: "Success!",
        description: "Your job has been posted successfully.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem posting your job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default PostJob;