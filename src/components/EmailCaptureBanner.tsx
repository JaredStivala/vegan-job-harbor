import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

export const EmailCaptureBanner = () => {
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Encode the email for the URL
    const encodedEmail = encodeURIComponent(email);
    
    // Make a request to Mailchimp in the background
    fetch(`https://babson.us8.list-manage.com/subscribe/post?u=bc5177e4337c59d1b3ada8ee8&id=21571d3969&f_id=00da4ee3f0&EMAIL=${encodedEmail}`, {
      mode: 'no-cors', // Since Mailchimp doesn't support CORS
      method: 'POST'
    });

    toast({
      title: "Thanks for subscribing! 🌱",
      description: "We'll keep you updated with the latest opportunities.",
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-sage text-white py-3 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold">
              🌟 Get Exclusive Vegan Job Alerts!
            </h3>
            <p className="text-cream/90 text-sm mt-1">
              Get updates about new opportunities in the vegan industry
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 w-full sm:w-auto"
              required
            />
            <Button 
              type="submit"
              className="bg-cream hover:bg-cream/90 text-sage-dark whitespace-nowrap"
            >
              Submit
            </Button>
          </form>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-2 top-2 p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};