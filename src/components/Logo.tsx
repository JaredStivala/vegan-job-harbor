import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-0.5">
      <img 
        src="/lovable-uploads/dcad0a79-71e5-4918-8b78-7638d2329569.png" 
        alt="WorkVeg Logo" 
        className="h-12 object-contain"
      />
    </Link>
  );
};