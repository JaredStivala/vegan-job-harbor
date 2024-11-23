import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const jobData = {
      page_title: formData.get("title"),
      company_name: formData.get("company"),
      location: formData.get("location"),
      salary: formData.get("salary"),
      description: formData.get("description"),
      url: formData.get("url"),
      tags: formData.get("tags")?.toString().split(",").map(tag => tag.trim()),
      date_posted: new Date().toISOString().split("T")[0],
    };

    try {
      const { error } = await supabase
        .from("veganjobs")
        .insert([jobData]);

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
            Share your vegan-friendly job opportunity with our community
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
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
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