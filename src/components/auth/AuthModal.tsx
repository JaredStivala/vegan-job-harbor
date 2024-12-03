import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: email, // Using email as password for simplicity
      });

      console.log("Auth response:", { data, error });

      if (error) {
        // If login fails, try to sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: email,
        });

        if (signUpError) {
          toast({
            title: "Error",
            description: signUpError.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success!",
            description: "You can now continue browsing jobs.",
          });
          onClose();
          navigate('/');
        }
      } else {
        toast({
          title: "Success!",
          description: "You can now continue browsing jobs.",
        });
        onClose();
        navigate('/');
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-sage-dark mb-4">
            Enter your email to continue
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <Button 
            type="submit" 
            className="w-full bg-sage hover:bg-sage-dark"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};