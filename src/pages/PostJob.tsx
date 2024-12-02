import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationPeriod, setVerificationPeriod] = useState<string>("");

  const calculateVerificationEndDate = () => {
    if (!isVerified || !verificationPeriod) return null;
    
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
      verification_end_date: calculateVerificationEndDate()?.toISOString(),
    };

    try {
      const { error } = await supabase
        .from("userSubmissions")
        .insert(jobData);

      if (error) throw error;

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

            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={isVerified}
                  onCheckedChange={(checked) => {
                    setIsVerified(checked as boolean);
                    if (!checked) setVerificationPeriod("");
                  }}
                />
                <Label htmlFor="verified">Verify this job posting</Label>
              </div>

              {isVerified && (
                <div className="ml-6">
                  <p className="text-sm text-gray-600 mb-2">Select verification period:</p>
                  <RadioGroup
                    value={verificationPeriod}
                    onValueChange={setVerificationPeriod}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="24h" id="24h" />
                      <Label htmlFor="24h">24 Hours</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3d" id="3d" />
                      <Label htmlFor="3d">3 Days</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1w" id="1w" />
                      <Label htmlFor="1w">1 Week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1m" id="1m" />
                      <Label htmlFor="1m">1 Month</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || (isVerified && !verificationPeriod)}
              className="bg-sage hover:bg-sage-dark"
            >
              {isSubmitting ? "Posting..." : "Post Job"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;