import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmailCaptureModal } from "./EmailCaptureModal";

export const PostJobButton = () => {
  const navigate = useNavigate();
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handlePostJobClick = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setShowEmailModal(true);
      return;
    }
    navigate('/post-job');
  };

  const handleEmailSubmit = () => {
    navigate('/post-job');
  };

  return (
    <>
      <Button 
        onClick={handlePostJobClick}
        className="bg-sage hover:bg-sage-dark text-white"
      >
        Post a Job
      </Button>

      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        action="post"
      />
    </>
  );
};