import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

export const EmailCaptureBanner = () => {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Show modal after user has scrolled 50% of the page
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage > 50 && !sessionStorage.getItem('modalShown')) {
        setIsOpen(true);
        sessionStorage.setItem('modalShown', 'true');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Encode the email for the URL
    const encodedEmail = encodeURIComponent(email);
    
    // Make a request to Mailchimp in the background
    fetch(`https://babson.us8.list-manage.com/subscribe/post?u=bc5177e4337c59d1b3ada8ee8&id=21571d3969&f_id=00da4ee3f0&EMAIL=${encodedEmail}`, {
      mode: 'no-cors',
      method: 'POST'
    });

    toast({
      title: "Welcome to the community! 🌱",
      description: "You're now part of a growing network of vegan professionals.",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-sage-dark">
            Join 5,000+ Vegan Professionals
          </DialogTitle>
          <DialogDescription className="text-center">
            <div className="mb-4">
              <img 
                src="/placeholder.svg" 
                alt="Community illustration" 
                className="w-32 h-32 mx-auto mb-4"
              />
              <p className="text-sage-dark/90 mb-2">
                Get exclusive access to:
              </p>
              <ul className="text-left text-sage-dark/80 space-y-2 mb-4 mx-auto max-w-[280px]">
                <li>• Early access to new vegan job opportunities</li>
                <li>• Salary insights from the industry</li>
                <li>• Networking events and community updates</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
          <Button 
            type="submit"
            className="w-full bg-sage hover:bg-sage/90 text-white"
          >
            Join the Community
          </Button>
          <p className="text-xs text-center text-sage-dark/60">
            Join 5,000+ professionals receiving weekly updates. Unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};