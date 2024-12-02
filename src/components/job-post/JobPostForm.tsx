import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { VerificationOptions } from "./VerificationOptions";
import { PRICING, formatPrice, calculateTotalPrice } from "@/config/pricing";

interface JobPostFormProps {
  isSubmitting: boolean;
  isVerified: boolean;
  verificationPeriod: string;
  setIsVerified: (checked: boolean) => void;
  setVerificationPeriod: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const JobPostForm = ({
  isSubmitting,
  isVerified,
  verificationPeriod,
  setIsVerified,
  setVerificationPeriod,
  onSubmit
}: JobPostFormProps) => {
  const totalPrice = calculateTotalPrice(isVerified, verificationPeriod);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="mb-6 p-4 bg-sage/5 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Pricing</h2>
        <div className="space-y-2">
          <p className="text-sm">Base job posting: {formatPrice(PRICING.BASE_JOB_POSTING)}</p>
          {isVerified && verificationPeriod && (
            <p className="text-sm">
              Verification ({verificationPeriod}): 
              {formatPrice(PRICING.VERIFICATION[verificationPeriod as keyof typeof PRICING.VERIFICATION])}
            </p>
          )}
          <div className="border-t pt-2 mt-2">
            <p className="text-lg font-semibold">
              Total: {formatPrice(totalPrice)}
            </p>
          </div>
        </div>
      </div>

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
          disabled={isSubmitting || (isVerified && !verificationPeriod)}
          className="bg-sage hover:bg-sage-dark"
        >
          {isSubmitting ? "Processing..." : `Pay ${formatPrice(totalPrice)}`}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};