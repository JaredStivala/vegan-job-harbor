import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VerificationOptions } from "./VerificationOptions";
import { PRICING, formatPrice, calculateTotalPrice } from "@/config/pricing";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmailCaptureModal } from "@/components/EmailCaptureModal";

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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setFormData(data);
      setShowEmailModal(true);
      return;
    }

    proceedWithSubmission(data);
  };

  const proceedWithSubmission = (data: FormData) => {
    // Prepare job data
    const jobData = {
      page_title: data.get("title"),
      company_name: data.get("company"),
      location: data.get("location"),
      salary: data.get("salary"),
      description: data.get("description"),
      url: data.get("url"),
      logo: data.get("logo"),
      tags: data.get("tags")?.toString().split(",").map(tag => tag.trim()),
      isVerified,
      verificationPeriod
    };

    // Redirect to Stripe payment link with metadata
    let paymentLink = `https://buy.stripe.com/cN28Acdzd3j29BC145?client_reference_id=${encodeURIComponent(JSON.stringify(jobData))}`; // Standard job posting link
    
    if (isVerified) {
      switch(verificationPeriod) {
        case '24h':
          paymentLink = `https://buy.stripe.com/fZe9Egdzd1aU5lm3ce?client_reference_id=${encodeURIComponent(JSON.stringify(jobData))}`;
          break;
        case '1w':
          paymentLink = `https://buy.stripe.com/3cs5o0dzdcTC5lmaEH?client_reference_id=${encodeURIComponent(JSON.stringify(jobData))}`;
          break;
        case '1m':
          paymentLink = `https://buy.stripe.com/bIY6s466L5ra0127sw?client_reference_id=${encodeURIComponent(JSON.stringify(jobData))}`;
          break;
      }
    }

    window.location.href = paymentLink;
  };

  const handleEmailSubmit = () => {
    if (formData) {
      proceedWithSubmission(formData);
    }
  };

  return (
    <>
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
            <span className="text-sm font-medium text-gray-700">Company Logo URL</span>
            <Input
              name="logo"
              type="url"
              placeholder="https://... (optional)"
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
            {isProcessing ? "Processing..." : `Post for ${formatPrice(calculateTotalPrice(isVerified, verificationPeriod))}`}
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

      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        action="post"
      />
    </>
  );
};