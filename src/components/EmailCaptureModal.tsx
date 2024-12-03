import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  action: 'post' | 'apply';
}

export const EmailCaptureModal = ({ isOpen, onClose, onSubmit, action }: EmailCaptureModalProps) => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      // Insert email into profiles table
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: crypto.randomUUID(),
          email: email,
        });

      if (error) {
        console.error('Error storing email:', error);
        toast({
          title: "Error",
          description: "Failed to save email. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Store in localStorage and proceed
      localStorage.setItem('userEmail', email);
      onSubmit(email);
      onClose();

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter your email to {action === 'post' ? 'post' : 'apply for'} a job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-sage hover:bg-sage-dark">
              Continue
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};