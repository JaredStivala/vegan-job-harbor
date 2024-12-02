import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { VerificationOptions } from "./VerificationOptions";
import { PRICING, formatPrice, calculateTotalPrice } from "@/config/pricing";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface JobPostFormProps {
  isSubmitting: boolean;
  isVerified: boolean;
  verificationPeriod: string;
  setIsVerified: (checked: boolean) => void;
  setVerificationPeriod: (value: string) => void;
}

export const JobPostForm = ({
  isSubmitting,
  isVerified,
  verificationPeriod,
  setIsVerified,
  setVerificationPeriod,
}: JobPostFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const formData = new FormData(e.currentTarget);
      const jobData = {
        page_title: formData.get("title"),
        company_name: formData.get("company"),
        location: formData.get("location"),
        salary: formData.get("salary"),
        description: formData.get("description"),
        url: formData.get("url"),
        tags: formData.get("tags")?.toString().split(",").map(tag => tag.trim()),
        isVerified,
        verificationPeriod
      };

      const price = calculateTotalPrice(isVerified, verificationPeriod);

      // Create checkout session
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ jobData, price }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Error",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Job Title</span>
          <Input
            name="title"
            required
            placeholder="e.g., Vegan Chef, Marketing Manager"
            className="mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Company</span>
          <Input
            name="company"
            required
            placeholder="Your company name"
            className="mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Location</span>
          <Input
            name="location"
            required
            placeholder="e.g., Remote, New York, NY"
            className="mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Salary Range</span>
          <Input
            name="salary"
            placeholder="e.g., $50,000 - $70,000"
            className="mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Job URL</span>
          <Input
            name="url"
            type="url"
            required
            placeholder="https://..."
            className="mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </span>
          <Input
            name="tags"
            placeholder="e.g., vegan, marketing, remote"
            className="mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Description</span>
          <Textarea
            name="description"
            required
            placeholder="Job description..."
            className="mt-1 h-48"
          />
        </label>

        <VerificationOptions
          isVerified={isVerified}
          verificationPeriod={verificationPeriod}
          setIsVerified={setIsVerified}
          setVerificationPeriod={setVerificationPeriod}
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isProcessing || (isVerified && !verificationPeriod)}
          className="bg-sage hover:bg-sage-dark"
        >
          {isProcessing ? "Processing..." : `Pay ${formatPrice(calculateTotalPrice(isVerified, verificationPeriod))}`}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};