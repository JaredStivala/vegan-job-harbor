import { Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";

export const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 bg-sage-dark/90 backdrop-blur-sm px-4 py-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Logo />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-cream"
          onClick={() => window.location.href = 'mailto:jaredworkveg@gmail.com'}
          title="Contact Us"
        >
          <Mail className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};